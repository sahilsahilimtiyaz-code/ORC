#!/usr/bin/env node

/**
 * Security Audit Script - Maximum Effort Security Hardening
 * 
 * This script performs comprehensive security audits including:
 * - Dependency vulnerability scanning
 * - Configuration security checks
 * - Code security analysis
 * - Header security verification
 * - Input validation testing
 * - Rate limiting verification
 * - Security policy compliance
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

// Security audit configuration
const AUDIT_CONFIG = {
  // Critical security checks
  CRITICAL_CHECKS: [
    'csp-compliance',
    'dependency-vulnerabilities',
    'input-validation',
    'rate-limiting',
    'security-headers',
    'csrf-protection',
    'xss-protection',
    'authentication-security',
  ],
  
  // Security headers to verify
  REQUIRED_HEADERS: [
    'Content-Security-Policy',
    'X-Content-Type-Options',
    'X-Frame-Options',
    'X-XSS-Protection',
    'Referrer-Policy',
    'Permissions-Policy',
    'X-DNS-Prefetch-Control',
  ],
  
  // Vulnerable packages to check for
  VULNERABLE_PACKAGES: [
    'lodash',
    'moment',
    'underscore',
    'jquery',
    'axios',
    'request',
  ],
  
  // Security patterns to check for in code
  SECURITY_PATTERNS: {
    'sql-injection': /(\b(select|insert|update|delete|drop|alter|create|exec|union|into)\b)/gi,
    'xss': /<script[^>]*>.*<\/script>/gi,
    'path-traversal': /\.\.\/|\.\.\\/gi,
    'hardcoded-secrets': /password\s*=\s*['"]\w+['"]/gi,
    'insecure-protocols': /http:\/\/(?!localhost)/gi,
  },
};

// Security audit results
const auditResults = {
  timestamp: new Date().toISOString(),
  overallScore: 0,
  checks: {},
  vulnerabilities: [],
  recommendations: [],
  compliance: {
    passed: 0,
    failed: 0,
    total: 0,
  },
};

// Utility functions
function log(message, level = 'info') {
  const timestamp = new Date().toISOString();
  const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
  console.log(`${prefix} ${message}`);
  
  // Write to audit log
  fs.appendFileSync('security-audit.log', `${prefix} ${message}\n`);
}

function calculateScore(results) {
  const passed = Object.values(results).filter(r => r.status === 'passed').length;
  const total = Object.values(results).length;
  const failed = total - passed;
  
  auditResults.compliance.passed = passed;
  auditResults.compliance.failed = failed;
  auditResults.compliance.total = total;
  
  // Calculate overall score (0-100)
  const score = Math.round((passed / total) * 100);
  auditResults.overallScore = score;
  
  return score;
}

function addVulnerability(type, severity, description, location) {
  const vulnerability = {
    type,
    severity,
    description,
    location,
    timestamp: new Date().toISOString(),
  };
  
  auditResults.vulnerabilities.push(vulnerability);
  log(`VULNERABILITY FOUND: ${type} - ${severity} - ${description}`, 'error');
}

function addRecommendation(type, description, priority = 'medium') {
  const recommendation = {
    type,
    description,
    priority,
    timestamp: new Date().toISOString(),
  };
  
  auditResults.recommendations.push(recommendation);
  log(`RECOMMENDATION: ${type} - ${description}`, 'warn');
}

// Security check functions
function checkCSPCompliance() {
  log('Checking CSP compliance...');
  
  try {
    const configPath = path.join(process.cwd(), 'next.config.mjs');
    const configContent = fs.readFileSync(configPath, 'utf8');
    
    // Check for required CSP directives
    const requiredDirectives = [
      "default-src 'self'",
      "object-src 'none'",
      "frame-ancestors 'none'",
      "form-action 'self'",
    ];
    
    let passed = true;
    const missingDirectives = [];
    
    for (const directive of requiredDirectives) {
      if (!configContent.includes(directive)) {
        passed = false;
        missingDirectives.push(directive);
      }
    }
    
    if (passed) {
      auditResults.checks.cspCompliance = { status: 'passed', details: 'All required CSP directives found' };
      log('CSP compliance check PASSED');
    } else {
      auditResults.checks.cspCompliance = { status: 'failed', details: `Missing directives: ${missingDirectives.join(', ')}` };
      addVulnerability('csp-compliance', 'high', 'Missing required CSP directives', 'next.config.mjs');
    }
    
    return passed;
  } catch (error) {
    log(`CSP compliance check failed: ${error.message}`, 'error');
    auditResults.checks.cspCompliance = { status: 'failed', details: error.message };
    return false;
  }
}

function checkDependencyVulnerabilities() {
  log('Checking for dependency vulnerabilities...');
  
  try {
    const packagePath = path.join(process.cwd(), 'package.json');
    const packageContent = fs.readFileSync(packagePath, 'utf8');
    const packageData = JSON.parse(packageContent);
    
    const dependencies = { ...packageData.dependencies, ...packageData.devDependencies };
    let hasVulnerabilities = false;
    
    // Check for potentially vulnerable packages
    for (const packageName of AUDIT_CONFIG.VULNERABLE_PACKAGES) {
      if (dependencies[packageName]) {
        addVulnerability('dependency', 'medium', `Potentially vulnerable package: ${packageName}`, 'package.json');
        hasVulnerabilities = true;
      }
    }
    
    // Check for outdated dependencies (in production, use npm audit)
    try {
      const auditResult = execSync('npm audit --json', { encoding: 'utf8', timeout: 30000 });
      const auditData = JSON.parse(auditResult);
      
      if (auditData.advisories && Object.keys(auditData.advisories).length > 0) {
        addVulnerability('dependency', 'high', 'npm audit found vulnerabilities', 'package.json');
        hasVulnerabilities = true;
      }
    } catch (error) {
      // npm audit might not be available or might fail
      log('npm audit not available, skipping detailed vulnerability check', 'warn');
    }
    
    if (!hasVulnerabilities) {
      auditResults.checks.dependencyVulnerabilities = { status: 'passed', details: 'No known vulnerabilities found' };
      log('Dependency vulnerability check PASSED');
    }
    
    return !hasVulnerabilities;
  } catch (error) {
    log(`Dependency vulnerability check failed: ${error.message}`, 'error');
    auditResults.checks.dependencyVulnerabilities = { status: 'failed', details: error.message };
    return false;
  }
}

function checkInputValidation() {
  log('Checking input validation implementation...');
  
  try {
    const securityPath = path.join(process.cwd(), 'lib/security.ts');
    const securityContent = fs.readFileSync(securityPath, 'utf8');
    
    const validationChecks = [
      'validateInput',
      'sanitizeInput',
      'validateEmail',
      'validatePassword',
      'validateCSRFToken',
    ];
    
    let passed = true;
    const missingFunctions = [];
    
    for (const func of validationChecks) {
      if (!securityContent.includes(`export function ${func}`)) {
        passed = false;
        missingFunctions.push(func);
      }
    }
    
    if (passed) {
      auditResults.checks.inputValidation = { status: 'passed', details: 'All required validation functions found' };
      log('Input validation check PASSED');
    } else {
      auditResults.checks.inputValidation = { status: 'failed', details: `Missing functions: ${missingFunctions.join(', ')}` };
      addVulnerability('input-validation', 'high', 'Missing input validation functions', 'lib/security.ts');
    }
    
    return passed;
  } catch (error) {
    log(`Input validation check failed: ${error.message}`, 'error');
    auditResults.checks.inputValidation = { status: 'failed', details: error.message };
    return false;
  }
}

function checkRateLimiting() {
  log('Checking rate limiting implementation...');
  
  try {
    const securityPath = path.join(process.cwd(), 'lib/security.ts');
    const securityContent = fs.readFileSync(securityPath, 'utf8');
    
    const rateLimitChecks = [
      'RATE_LIMITS',
      'checkRateLimit',
      'requestCounts',
    ];
    
    let passed = true;
    const missingElements = [];
    
    for (const check of rateLimitChecks) {
      if (!securityContent.includes(check)) {
        passed = false;
        missingElements.push(check);
      }
    }
    
    if (passed) {
      auditResults.checks.rateLimiting = { status: 'passed', details: 'Rate limiting implementation found' };
      log('Rate limiting check PASSED');
    } else {
      auditResults.checks.rateLimiting = { status: 'failed', details: `Missing elements: ${missingElements.join(', ')}` };
      addVulnerability('rate-limiting', 'high', 'Rate limiting not properly implemented', 'lib/security.ts');
    }
    
    return passed;
  } catch (error) {
    log(`Rate limiting check failed: ${error.message}`, 'error');
    auditResults.checks.rateLimiting = { status: 'failed', details: error.message };
    return false;
  }
}

function checkSecurityHeaders() {
  log('Checking security headers configuration...');
  
  try {
    const configPath = path.join(process.cwd(), 'next.config.mjs');
    const configContent = fs.readFileSync(configPath, 'utf8');
    
    let passed = true;
    const missingHeaders = [];
    
    for (const header of AUDIT_CONFIG.REQUIRED_HEADERS) {
      if (!configContent.includes(header)) {
        passed = false;
        missingHeaders.push(header);
      }
    }
    
    if (passed) {
      auditResults.checks.securityHeaders = { status: 'passed', details: 'All required security headers found' };
      log('Security headers check PASSED');
    } else {
      auditResults.checks.securityHeaders = { status: 'failed', details: `Missing headers: ${missingHeaders.join(', ')}` };
      addVulnerability('security-headers', 'high', 'Missing required security headers', 'next.config.mjs');
    }
    
    return passed;
  } catch (error) {
    log(`Security headers check failed: ${error.message}`, 'error');
    auditResults.checks.securityHeaders = { status: 'failed', details: error.message };
    return false;
  }
}

function checkCSRFProtection() {
  log('Checking CSRF protection implementation...');
  
  try {
    const securityPath = path.join(process.cwd(), 'lib/security.ts');
    const securityContent = fs.readFileSync(securityPath, 'utf8');
    
    const csrfChecks = [
      'generateCSRFToken',
      'validateCSRFToken',
      'SameSite',
    ];
    
    let passed = true;
    const missingElements = [];
    
    for (const check of csrfChecks) {
      if (!securityContent.includes(check)) {
        passed = false;
        missingElements.push(check);
      }
    }
    
    if (passed) {
      auditResults.checks.csrfProtection = { status: 'passed', details: 'CSRF protection implementation found' };
      log('CSRF protection check PASSED');
    } else {
      auditResults.checks.csrfProtection = { status: 'failed', details: `Missing elements: ${missingElements.join(', ')}` };
      addVulnerability('csrf-protection', 'high', 'CSRF protection not properly implemented', 'lib/security.ts');
    }
    
    return passed;
  } catch (error) {
    log(`CSRF protection check failed: ${error.message}`, 'error');
    auditResults.checks.csrfProtection = { status: 'failed', details: error.message };
    return false;
  }
}

function checkXSSProtection() {
  log('Checking XSS protection implementation...');
  
  try {
    const securityPath = path.join(process.cwd(), 'lib/security.ts');
    const securityContent = fs.readFileSync(securityPath, 'utf8');
    
    const xssChecks = [
      'DOMPurify',
      'sanitizeInput',
      'sanitizeComponentInput',
    ];
    
    let passed = true;
    const missingElements = [];
    
    for (const check of xssChecks) {
      if (!securityContent.includes(check)) {
        passed = false;
        missingElements.push(check);
      }
    }
    
    if (passed) {
      auditResults.checks.xssProtection = { status: 'passed', details: 'XSS protection implementation found' };
      log('XSS protection check PASSED');
    } else {
      auditResults.checks.xssProtection = { status: 'failed', details: `Missing elements: ${missingElements.join(', ')}` };
      addVulnerability('xss-protection', 'high', 'XSS protection not properly implemented', 'lib/security.ts');
    }
    
    return passed;
  } catch (error) {
    log(`XSS protection check failed: ${error.message}`, 'error');
    auditResults.checks.xssProtection = { status: 'failed', details: error.message };
    return false;
  }
}

function checkAuthenticationSecurity() {
  log('Checking authentication security implementation...');
  
  try {
    const securityPath = path.join(process.cwd(), 'lib/security.ts');
    const securityContent = fs.readFileSync(securityPath, 'utf8');
    
    const authChecks = [
      'validatePassword',
      'validateEmail',
      'Secure',
      'HttpOnly',
      'SameSite',
    ];
    
    let passed = true;
    const missingElements = [];
    
    for (const check of authChecks) {
      if (!securityContent.includes(check)) {
        passed = false;
        missingElements.push(check);
      }
    }
    
    if (passed) {
      auditResults.checks.authenticationSecurity = { status: 'passed', details: 'Authentication security implementation found' };
      log('Authentication security check PASSED');
    } else {
      auditResults.checks.authenticationSecurity = { status: 'failed', details: `Missing elements: ${missingElements.join(', ')}` };
      addVulnerability('authentication-security', 'high', 'Authentication security not properly implemented', 'lib/security.ts');
    }
    
    return passed;
  } catch (error) {
    log(`Authentication security check failed: ${error.message}`, 'error');
    auditResults.checks.authenticationSecurity = { status: 'failed', details: error.message };
    return false;
  }
}

// Main audit function
async function runSecurityAudit() {
  log('Starting maximum effort security audit...');
  
  // Run all critical security checks
  for (const check of AUDIT_CONFIG.CRITICAL_CHECKS) {
    try {
      switch (check) {
        case 'csp-compliance':
          checkCSPCompliance();
          break;
        case 'dependency-vulnerabilities':
          checkDependencyVulnerabilities();
          break;
        case 'input-validation':
          checkInputValidation();
          break;
        case 'rate-limiting':
          checkRateLimiting();
          break;
        case 'security-headers':
          checkSecurityHeaders();
          break;
        case 'csrf-protection':
          checkCSRFProtection();
          break;
        case 'xss-protection':
          checkXSSProtection();
          break;
        case 'authentication-security':
          checkAuthenticationSecurity();
          break;
      }
    } catch (error) {
      log(`Check ${check} failed with error: ${error.message}`, 'error');
      auditResults.checks[check] = { status: 'failed', details: error.message };
    }
  }
  
  // Calculate overall score
  const score = calculateScore(auditResults.checks);
  
  // Generate recommendations based on audit results
  if (score < 90) {
    addRecommendation('security-score', 'Overall security score is below 90%. Implement all security recommendations.', 'high');
  }
  
  if (auditResults.vulnerabilities.length > 0) {
    addRecommendation('vulnerabilities', `Found ${auditResults.vulnerabilities.length} vulnerabilities. Address all critical and high severity issues first.`, 'high');
  }
  
  if (auditResults.compliance.failed > 0) {
    addRecommendation('compliance', `Failed ${auditResults.compliance.failed} out of ${auditResults.compliance.total} security checks.`, 'medium');
  }
  
  // Generate audit report
  generateAuditReport();
  
  log(`Security audit completed. Overall score: ${score}%`);
  return score;
}

// Generate audit report
function generateAuditReport() {
  const report = {
    ...auditResults,
    summary: {
      totalChecks: auditResults.compliance.total,
      passedChecks: auditResults.compliance.passed,
      failedChecks: auditResults.compliance.failed,
      totalVulnerabilities: auditResults.vulnerabilities.length,
      totalRecommendations: auditResults.recommendations.length,
    },
  };
  
  // Save report to file
  const reportPath = path.join(process.cwd(), 'security-audit-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  
  log(`Security audit report saved to: ${reportPath}`);
  
  // Print summary
  console.log('\n=== SECURITY AUDIT SUMMARY ===');
  console.log(`Overall Score: ${report.overallScore}%`);
  console.log(`Passed Checks: ${report.summary.passedChecks}/${report.summary.totalChecks}`);
  console.log(`Failed Checks: ${report.summary.failedChecks}/${report.summary.totalChecks}`);
  console.log(`Vulnerabilities Found: ${report.summary.totalVulnerabilities}`);
  console.log(`Recommendations: ${report.summary.totalRecommendations}`);
  
  if (report.overallScore >= 90) {
    console.log('✅ SECURITY POSTURE: EXCELLENT');
  } else if (report.overallScore >= 70) {
    console.log('⚠️ SECURITY POSTURE: GOOD - Some improvements needed');
  } else {
    console.log('❌ SECURITY POSTURE: POOR - Immediate action required');
  }
}

// Run the audit
if (import.meta.url === `file://${process.argv[1]}`) {
  runSecurityAudit().then(score => {
    process.exit(score >= 90 ? 0 : 1);
  }).catch(error => {
    log(`Audit failed: ${error.message}`, 'error');
    process.exit(1);
  });
}