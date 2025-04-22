# GitHub Workflow Validation Setup

This document outlines the setup and configuration of pre-commit hooks for GitHub workflow validation.

## Prerequisites

- [Husky](https://typicode.github.io/husky/) installed in your project
- [actionlint](https://github.com/rhysd/actionlint) installed on your system

## Installation

1. Install actionlint:
   ```bash
   # macOS
   brew install actionlint
   
   # Linux
   sudo snap install actionlint
   
   # Windows (using scoop)
   scoop install actionlint
   ```

2. Ensure Husky is installed and configured:
   ```bash
   yarn add -D husky
   yarn husky install
   ```

3. The pre-commit hook is automatically set up in `.husky/pre-commit`

## Validation Features

The pre-commit hook performs the following checks:

- Syntax validation of YAML files
- Schema validation against GitHub Actions specifications
- Secret usage validation
- Workflow structure validation
- Job dependencies validation
- Environment variable validation

## Usage

The hook runs automatically when committing changes to workflow files. It will:

1. Only trigger when workflow files are modified
2. Run validation checks
3. Provide clear error messages if issues are found
4. Allow bypass with `--no-verify` if needed

## Error Handling

If validation fails:
- Detailed error messages are displayed
- Commit is prevented
- Instructions for fixing issues are provided
- Option to bypass validation is shown

## Performance

The hook is optimized for speed:
- Only runs on workflow file changes
- Uses efficient validation tools
- Completes in <300ms for typical workflows

## Troubleshooting

Common issues and solutions:

1. **actionlint not found**
   - Ensure actionlint is installed correctly
   - Check PATH environment variable

2. **Validation errors**
   - Review error messages for specific issues
   - Check GitHub Actions documentation for correct syntax
   - Verify secret usage patterns

3. **Hook not running**
   - Verify Husky installation
   - Check file permissions on hook script
   - Ensure git hooks are enabled

## Maintenance

To update validation rules:
1. Modify `.husky/pre-commit`
2. Update actionlint configuration if needed
3. Test changes with sample workflow files 