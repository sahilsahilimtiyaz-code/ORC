#!/usr/bin/env node

/**
 * Comprehensive Security Scanner - Maximum Effort Security Hardening
 * 
 * This script performs deep security scanning including:
 * - Static code analysis for security vulnerabilities
 * - Dependency scanning for known vulnerabilities
 * - Configuration security auditing
 * - Secret detection
 * - OWASP Top 10 compliance checking
 * - Security misconfiguration detection
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

// Security scanning configuration
const SCAN_CONFIG = {
  // Directories to scan
  SCAN_DIRS: [
    'app',
    'components',
    'lib',
    'scripts',
    'public',
  ],
  
  // File extensions to scan
  SCAN_EXTENSIONS: ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.json', '.md'],
  
  // OWASP Top 10 2021 categories
  OWASP_CATEGORIES: {
    'A01:2021': 'Broken Access Control',
    'A02:2021': 'Cryptographic Failures',
    'A03:2021': 'Injection',
    'A04:2021': 'Insecure Design',
    'A05:2021': 'Security Misconfiguration',
    'A06:2021': 'Vulnerable and Outdated Components',
    'A07:2021': 'Identification and Authentication Failures',
    'A08:2021': 'Software and Data Integrity Failures',
    'A09:2021': 'Security Logging and Monitoring Failures',
    'A10:2021': 'Server-Side Request Forgery (SSRF)',
  },
  
  // Security patterns to detect (vulnerabilities)
  VULNERABILITY_PATTERNS: {
    // Injection flaws
    'sql-injection': {
      pattern: /(\b(select|insert|update|delete|drop|alter|create|exec|union|into)\b.*\$\{|`.*\$\{)/gi,
      severity: 'critical',
      category: 'A03:2021',
    },
    'nosql-injection': {
      pattern: /\$\{.*\}\s*[=<>]/gi,
      severity: 'high',
      category: 'A03:2021',
    },
    'command-injection': {
      pattern: /(exec|spawn|system)\s*\(\s*.*\$\{.*\}/gi,
      severity: 'critical',
      category: 'A03:2021',
    },
    'ldap-injection': {
      pattern: /(ldap|directory)\s*.*\$\{/gi,
      severity: 'high',
      category: 'A03:2021',
    },
    
    // XSS vulnerabilities
    'reflected-xss': {
      pattern: /dangerouslySetInnerHTML\s*=\s*\{.*\}/gi,
      severity: 'high',
      category: 'A03:2021',
    },
    'stored-xss': {
      pattern: /innerHTML\s*=\s*.*\$\{/gi,
      severity: 'high',
      category: 'A03:2021',
    },
    'dom-xss': {
      pattern: /(document\.write|document\.writeln|eval|setTimeout|setInterval)\s*\(\s*.*\$\{/gi,
      severity: 'high',
      category: 'A03:2021',
    },
    
    // Broken access control
    'missing-auth-check': {
      pattern: /export\s+(async\s+)?function\s+\w+\(.*request.*\)\s*\{/gi,
      severity: 'medium',
      category: 'A01:2021',
    },
    'insecure-direct-object-reference': {
      pattern: /(id|userId|accountId)\s*[:=]\s*\$\{.*\}/gi,
      severity: 'medium',
      category: 'A01:2021',
    },
    
    // Cryptographic failures
    'weak-crypto': {
      pattern: /(md5|sha1|des|rc4|ecb)\s*\(/gi,
      severity: 'high',
      category: 'A02:2021',
    },
    'hardcoded-secrets': {
      pattern: /(apiKey|secret|password|token|key)\s*[:=]\s*['"][^'"]{8,}['"]/gi,
      severity: 'critical',
      category: 'A02:2021',
    },
    'insecure-random': {
      pattern: /Math\.random\(\)/gi,
      severity: 'medium',
      category: 'A02:2021',
    },
    
    // Insecure design
    'missing-rate-limit': {
      pattern: /export\s+(async\s+)?function\s+\w+\(.*\)\s*\{[^}]*\}/gi,
      severity: 'medium',
      category: 'A04:2021',
    },
    'missing-validation': {
      pattern: /\.json\(\)\s*\.\s*then\s*\(/gi,
      severity: 'medium',
      category: 'A04:2021',
    },
    
    // Security misconfiguration
    'debug-enabled': {
      pattern: /(debug|DEV|development)\s*[:=]\s*true/gi,
      severity: 'low',
      category: 'A05:2021',
    },
    'verbose-errors': {
      pattern: /console\.(log|error|warn)\s*\(.*(error|exception|stack)/gi,
      severity: 'low',
      category: 'A05:2021',
    },
    'cors-wildcard': {
      pattern: /Access-Control-Allow-Origin\s*[:=]\s*['"]\*['"]/gi,
      severity: 'high',
      category: 'A05:2021',
    },
    'missing-security-headers': {
      pattern: /helmet|csp|content-security-policy/gi,
      severity: 'medium',
      category: 'A05:2021',
      invert: true, // Should have this
    },
    
    // Vulnerable components
    'outdated-dependencies': {
      pattern: /"dependencies"|"devDependencies"/gi,
      severity: 'info',
      category: 'A06:2021',
      check: 'package-json',
    },
    
    // Authentication failures
    'weak-password-policy': {
      pattern: /password.*length\s*[<>=]\s*[0-7]/gi,
      severity: 'medium',
      category: 'A07:2021',
    },
    'missing-mfa': {
      pattern: /authentication|login|signin/gi,
      severity: 'info',
      category: 'A07:2021',
      check: 'mfa',
    },
    'session-fixation': {
      pattern: /session\s*[:=].*fixed/gi,
      severity: 'high',
      category: 'A07:2021',
    },
    
    // Integrity failures
    'unsafe-deserialization': {
      pattern: /(JSON\.parse|eval|Function)\s*\(\s*.*request/gi,
      severity: 'high',
      category: 'A08:2021',
    },
    'missing-integrity-check': {
      pattern: /fetch|axios|request\s*\(/gi,
      severity: 'medium',
      category: 'A08:2021',
      check: 'integrity',
    },
    
    // Logging failures
    'missing-security-logging': {
      pattern: /console\.(log|error|warn)/gi,
      severity: 'low',
      category: 'A09:2021',
      check: 'security-logging',
    },
    
    // SSRF
    'ssrf': {
      pattern: /(fetch|axios|request)\s*\(\s*.*\$\{.*\}/gi,
      severity: 'high',
      category: 'A10:2021',
    },
  },
  
  // Secret patterns
  SECRET_PATTERNS: [
    /(api[_-]?key|apikey)\s*[:=]\s*['"][a-zA-Z0-9_\-]{20,}['"]/gi,
    /(secret[_-]?key|secretkey)\s*[:=]\s*['"][a-zA-Z0-9_\-]{20,}['"]/gi,
    /(access[_-]?token|accesstoken)\s*[:=]\s*['"][a-zA-Z0-9_\-]{20,}['"]/gi,
    /(jwt[_-]?secret|jwtsecret)\s*[:=]\s*['"][a-zA-Z0-9_\-]{20,}['"]/gi,
    /(database[_-]?url|db[_-]?url)\s*[:=]\s*['"][^'"]*['"]/gi,
    /(private[_-]?key|privatekey)\s*[:=]\s*['"][^'"]*['"]/gi,
    /-----BEGIN\s+(RSA\s+)?PRIVATE\s+KEY-----/gi,
    /-----BEGIN\s+OPENSSH\s+PRIVATE\s+KEY-----/gi,
  ],
  
  // Files to exclude from scanning
  EXCLUDE_PATTERNS: [
    'node_modules',
    '.next',
    '.git',
    'dist',
    'build',
    'coverage',
    '*.min.js',
    '*.map',
    'security-audit.log',
    'security-audit-report.json',
  ],
};

// Scan results
const scanResults = {
  timestamp: new Date().toISOString(),
  filesScanned: 0,
  vulnerabilities: [],
  secrets: [],
  owaspCompliance: {},
  summary: {
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
    info: 0,
  },
};

// Utility functions
function log(message, level = 'info') {
  const timestamp = new Date().toISOString();
  const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
  console.log(`${prefix} ${message}`);
}

function shouldExclude(filePath) {
  return SCAN_CONFIG.EXCLUDE_PATTERNS.some(pattern => {
    if (pattern.includes('*')) {
      const regex = new RegExp('^' + pattern.replace('*', '.*') + '$');
      return regex.test(filePath);
    }
    return filePath.includes(pattern);
  });
}

function getFilesToScan(dir) {
  const files = [];
  
  function scanDirectory(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      const relativePath = path.relative(process.cwd(), fullPath);
      
      if (shouldExclude(relativePath)) {
        continue;
      }
      
      if (entry.isDirectory()) {
        scanDirectory(fullPath);
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name);
        if (SCAN_CONFIG.SCAN_EXTENSIONS.includes(ext)) {
          files.push(fullPath);
        }
      }
    }
  }
  
  scanDirectory(dir);
  return files;
}

function scanFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    const relativePath = path.relative(process.cwd(), filePath);
    
    scanResults.filesScanned++;
    
    // Scan for vulnerability patterns
    for (const [vulnName, vulnConfig] of Object.entries(SCAN_CONFIG.VULNERABILITY_PATTERNS)) {
      const { pattern, severity, category, invert, check } = vulnConfig;
      
      if (check === 'package-json' && !filePath.endsWith('package.json')) {
        continue;
      }
      
      if (check === 'mfa' && !content.includes('mfa') && !content.includes('2fa') && !content.includes('totp')) {
        // Only flag if auth-related but no MFA
        if (content.includes('auth') || content.includes('login')) {
          const matches = [...content.matchAll(pattern)];
          if (matches.length > 0) {
            scanResults.vulnerabilities.push({
              type: vulnName,
              severity,
              category,
              file: relativePath,
              line: matches[0].index ? content.substring(0, matches[0].index).split('\n').length : 1,
              description: `Potential ${vulnName.replace('-', ' ')} detected`,
            });
            scanResults.summary[severity]++;
          }
        }
        continue;
      }
      
      if (check === 'integrity' && !content.includes('integrity') && !content.includes('hash')) {
        // Only flag external requests without integrity checks
        const matches = [...content.matchAll(pattern)];
        if (matches.length > 0) {
          scanResults.vulnerabilities.push({
            type: vulnName,
            severity,
            category,
            file: relativePath,
            line: matches[0].index ? content.substring(0, matches[0].index).split('\n').length : 1,
            description: `External request without integrity verification`,
          });
          scanResults.summary[severity]++;
        }
        continue;
      }
      
      if (check === 'security-logging' && content.includes('security')) {
        continue; // Has security logging
      }
      
      if (invert) {
        // Pattern should exist but doesn't
        if (!pattern.test(content)) {
          scanResults.vulnerabilities.push({
            type: vulnName,
            severity,
            category,
            file: relativePath,
            line: 1,
            description: `Missing security control: ${vulnName}`,
          });
          scanResults.summary[severity]++;
        }
      } else {
        // Pattern should not exist
        const matches = [...content.matchAll(pattern)];
        for (const match of matches) {
          const lineNumber = content.substring(0, match.index).split('\n').length;
          scanResults.vulnerabilities.push({
            type: vulnName,
            severity,
            category,
            file: relativePath,
            line: lineNumber,
            description: `Potential ${vulnName.replace('-', ' ')} at line ${lineNumber}`,
            context: lines[lineNumber - 1]?.substring(0, 100) || '',
          });
          scanResults.summary[severity]++;
        }
      }
    }
    
    // Scan for secrets
    for (const secretPattern of SCAN_CONFIG.SECRET_PATTERNS) {
      const matches = [...content.matchAll(secretPattern)];
      for (const match of matches) {
        const lineNumber = content.substring(0, match.index).split('\n').length;
        scanResults.secrets.push({
          file: relativePath,
          line: lineNumber,
          pattern: secretPattern.source,
          context: lines[lineNumber - 1]?.substring(0, 100) || '',
        });
        scanResults.summary.critical++;
      }
    }
    
  } catch (error) {
    log(`Error scanning ${filePath}: ${error.message}`, 'warn');
  }
}

function runNpmAudit() {
  log('Running npm audit...');
  
  try {
    const result = execSync('npm audit --json', { 
      encoding: 'utf8', 
      timeout: 60000 
    });
    
    const auditData = JSON.parse(result);
    
    if (auditData.vulnerabilities) {
      for (const [pkgName, vuln] of Object.entries(auditData.vulnerabilities)) {
        const severity = vuln.severity || 'unknown';
        scanResults.vulnerabilities.push({
          type: 'npm-vulnerability',
          severity,
          category: 'A06:2021',
          file: 'package.json',
          line: 1,
          description: `Vulnerable dependency: ${pkgName} - ${vuln.title || 'Unknown vulnerability'}`,
        });
        scanResults.summary[severity] = (scanResults.summary[severity] || 0) + 1;
      }
    }
    
    if (auditData.metadata && auditData.metadata.vulnerabilities) {
      log(`npm audit found ${auditData.metadata.vulnerabilities.total} vulnerabilities`);
      log(`  Critical: ${auditData.metadata.vulnerabilities.critical || 0}`);
      log(`  High: ${auditData.metadata.vulnerabilities.high || 0}`);
      log(`  Moderate: ${auditData.metadata.vulnerabilities.moderate || 0}`);
      log(`  Low: ${auditData.metadata.vulnerabilities.low || 0}`);
    }
  } catch (error) {
    log(`npm audit failed: ${error.message}`, 'warn');
  }
}

function checkOwaspCompliance() {
  log('Checking OWASP Top 10 compliance...');
  
  for (const [code, name] of Object.entries(SCAN_CONFIG.OWASP_CATEGORIES)) {
    const vulnerabilities = scanResults.vulnerabilities.filter(v => v.category === code);
    const criticalHigh = vulnerabilities.filter(v => v.severity === 'critical' || v.severity === 'high');
    
    scanResults.owaspCompliance[code] = {
      name,
      totalVulnerabilities: vulnerabilities.length,
      criticalHigh: criticalHigh.length,
      status: criticalHigh.length === 0 ? 'PASS' : 'FAIL',
    };
  }
}

function generateReport() {
  const reportPath = path.join(process.cwd(), 'security-scan-report.json');
  
  const report = {
    ...scanResults,
    owaspSummary: {
      passed: Object.values(scanResults.owaspCompliance).filter(c => c.status === 'PASS').length,
      failed: Object.values(scanResults.owaspCompliance).filter(c => c.status === 'FAIL').length,
      total: Object.keys(scanResults.owaspCompliance).length,
    },
  };
  
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  log(`Security scan report saved to: ${reportPath}`);
  
  return report;
}

function printSummary(report) {
  console.log('\n' + '='.repeat(60));
  console.log('🔍 SECURITY SCAN RESULTS');
  console.log('='.repeat(60));
  
  console.log(`\n📁 Files Scanned: ${report.filesScanned}`);
  console.log(`🔴 Critical: ${report.summary.critical}`);
  console.log(`🟠 High: ${report.summary.high}`);
  console.log(`🟡 Medium: ${report.summary.medium}`);
  console.log(`🔵 Low: ${report.summary.low}`);
  console.log(`⚪ Info: ${report.summary.info}`);
  console.log(`🔑 Secrets Found: ${report.secrets.length}`);
  
  console.log('\n📋 OWASP TOP 10 COMPLIANCE:');
  console.log('-'.repeat(60));
  for (const [code, compliance] of Object.entries(report.owaspCompliance)) {
    const status = compliance.status === 'PASS' ? '✅' : '❌';
    console.log(`  ${status} ${code} - ${compliance.name}`);
    console.log(`      Vulnerabilities: ${compliance.totalVulnerabilities} (Critical/High: ${compliance.criticalHigh})`);
  }
  
  console.log(`\n📊 OWASP Summary: ${report.owaspSummary.passed}/${report.owaspSummary.total} PASS`);
  
  if (report.vulnerabilities.length > 0) {
    console.log('\n🚨 TOP VULNERABILITIES:');
    console.log('-'.repeat(60));
    
    const sortedVulns = [...report.vulnerabilities].sort((a, b) => {
      const severityOrder = { critical: 0, high: 1, medium: 2, low: 3, info: 4 };
      return severityOrder[a.severity] - severityOrder[b.severity];
    });
    
    for (const vuln of sortedVulns.slice(0, 20)) {
      const severityIcon = {
        critical: '🔴',
        high: '🟠',
        medium: '🟡',
        low: '🔵',
        info: '⚪',
      }[vuln.severity] || '⚪';
      
      console.log(`  ${severityIcon} [${vuln.severity.toUpperCase()}] ${vuln.type}`);
      console.log(`      File: ${vuln.file}:${vuln.line}`);
      console.log(`      Category: ${vuln.category}`);
      console.log(`      ${vuln.description}`);
      if (vuln.context) {
        console.log(`      Code: ${vuln.context.trim()}`);
      }
      console.log();
    }
  }
  
  if (report.secrets.length > 0) {
    console.log('\n🔑 SECRETS DETECTED:');
    console.log('-'.repeat(60));
    for (const secret of report.secrets.slice(0, 10)) {
      console.log(`  🔴 File: ${secret.file}:${secret.line}`);
      console.log(`      Context: ${secret.context.trim()}`);
      console.log();
    }
  }
  
  // Overall assessment
  const totalCriticalHigh = report.summary.critical + report.summary.high;
  console.log('\n🎯 OVERALL SECURITY POSTURE:');
  if (totalCriticalHigh === 0 && report.secrets.length === 0) {
    console.log('  ✅ EXCELLENT - No critical/high vulnerabilities or secrets');
  } else if (totalCriticalHigh <= 5) {
    console.log('  ⚠️  GOOD - Minor issues to address');
  } else if (totalCriticalHigh <= 15) {
    console.log('  🔶 MODERATE - Several issues need attention');
  } else {
    console.log('  🔴 POOR - Immediate remediation required');
  }
}

// Main execution
async function main() {
  console.log('🛡️  COMPREHENSIVE SECURITY SCANNER');
  console.log('Maximum Effort Security Hardening');
  console.log('='.repeat(60) + '\n');
  
  log('Starting security scan...');
  
  // Scan all directories
  for (const dir of SCAN_CONFIG.SCAN_DIRS) {
    const dirPath = path.join(process.cwd(), dir);
    if (fs.existsSync(dirPath)) {
      log(`Scanning directory: ${dir}`);
      const files = getFilesToScan(dirPath);
      
      for (const file of files) {
        scanFile(file);
      }
    } else {
      log(`Directory not found: ${dir}`, 'warn');
    }
  }
  
  // Run npm audit
  runNpmAudit();
  
  // Check OWASP compliance
  checkOwaspCompliance();
  
  // Generate and print report
  const report = generateReport();
  printSummary(report);
  
  // Exit with appropriate code
  const hasCriticalHigh = report.summary.critical + report.summary.high > 0;
  const hasSecrets = report.secrets.length > 0;
  
  if (hasCriticalHigh || hasSecrets) {
    log('Security scan found critical issues!', 'error');
    process.exit(1);
  } else {
    log('Security scan passed!', 'success');
    process.exit(0);
  }
}

main().catch(error => {
  log(`Security scan failed: ${error.message}`, 'error');
  process.exit(1);
});