# Developer Setup Guide

## Package Manager

This project uses **Yarn** as its package manager. Using `npm` commands will conflict with the `yarn.lock` file and may cause dependency drift.

### Installation

1. Install Yarn globally (if not already installed):
   ```bash
   npm install -g yarn
   ```

2. Install project dependencies:
   ```bash
   yarn install
   ```

### Best Practices

1. **Always use Yarn commands**:
   ```bash
   # Add a new dependency
   yarn add <package>

   # Add a dev dependency
   yarn add -D <package>

   # Remove a dependency
   yarn remove <package>

   # Update dependencies
   yarn upgrade
   ```

2. **Never use npm commands**:
   ❌ `npm install`
   ❌ `npm i <package>`
   ❌ `npm uninstall <package>`
   ❌ `npm update`

3. **Lockfile Management**:
   - Keep `yarn.lock` in version control
   - Never commit `package-lock.json`
   - If `package-lock.json` appears, delete it and run `yarn install`

4. **Dependency Updates**:
   - Use `yarn upgrade-interactive` for controlled updates
   - Review changelogs before major version updates
   - Test thoroughly after dependency updates

5. **Troubleshooting**:
   If you encounter dependency issues:
   ```bash
   # Clear yarn cache
   yarn cache clean

   # Remove node_modules
   rm -rf node_modules

   # Reinstall dependencies
   yarn install
   ```

### Common Issues

1. **Lockfile Conflicts**:
   - If you accidentally used npm, delete `package-lock.json`
   - Run `yarn install` to regenerate `yarn.lock`

2. **Version Mismatches**:
   - Check `yarn.lock` for exact versions
   - Use `yarn why <package>` to debug dependency trees

3. **Peer Dependencies**:
   - Use `yarn add --peer` for peer dependencies
   - Check compatibility before adding

### CI/CD Integration

1. **Git Hooks**:
   - Pre-commit hook checks for `package-lock.json`
   - Pre-push hook verifies `yarn.lock` integrity

2. **Build Pipeline**:
   ```yaml
   steps:
     - name: Install dependencies
       run: yarn install --frozen-lockfile
   ```

### Version Control

1. **Files to Commit**:
   - `package.json`
   - `yarn.lock`
   - `.yarnrc` (if exists)

2. **Files to Ignore**:
   - `node_modules/`
   - `package-lock.json`
   - `.npm/`
   - `.yarn/cache/`

### Performance Tips

1. **Cache Management**:
   ```bash
   # Enable zero-installs
   yarn set version berry
   yarn config set enableGlobalCache true
   ```

2. **Installation Speed**:
   ```bash
   # Use network concurrency
   yarn config set networkConcurrency 8
   ```

### Security

1. **Audit Dependencies**:
   ```bash
   yarn audit
   ```

2. **Update Vulnerabilities**:
   ```bash
   yarn upgrade-interactive --latest
   ```

Remember: Consistency in package management is crucial for team collaboration and project stability. Always use Yarn commands to maintain a single source of truth for dependencies. 