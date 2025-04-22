# Release Tagging Guide

## Versioning Strategy

### Semantic Versioning
We follow [Semantic Versioning 2.0.0](https://semver.org/):
- MAJOR version for incompatible API changes
- MINOR version for backward-compatible functionality
- PATCH version for backward-compatible bug fixes

### Version Format
```
vMAJOR.MINOR.PATCH[-prerelease][+build]
```

Examples:
- `v1.0.0` - Initial release
- `v1.1.0` - New features
- `v1.1.1` - Bug fixes
- `v1.2.0-beta.1` - Beta release
- `v1.2.0-rc.1` - Release candidate

## Release Process

### 1. Pre-release Checklist
- [ ] All tests passing
- [ ] Documentation updated
- [ ] Changelog updated
- [ ] Version bumped
- [ ] Dependencies verified
- [ ] Security audit complete

### 2. Creating a Release
```bash
# Update version in package.json
npm version [major|minor|patch]

# Create and push tag
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0

# Create GitHub release
gh release create v1.0.0 --generate-notes
```

### 3. Post-release Tasks
- [ ] Update documentation
- [ ] Announce release
- [ ] Monitor deployment
- [ ] Verify production
- [ ] Update roadmap

## Tagging Guidelines

### 1. Tag Format
```bash
# Major release
git tag -a v1.0.0 -m "Release v1.0.0"

# Minor release
git tag -a v1.1.0 -m "Release v1.1.0"

# Patch release
git tag -a v1.1.1 -m "Release v1.1.1"

# Pre-release
git tag -a v1.2.0-beta.1 -m "Beta v1.2.0-beta.1"
```

### 2. Tag Message Format
```
Release vX.Y.Z

Changes:
- Feature 1
- Feature 2
- Bug fix 1
- Bug fix 2

Breaking Changes:
- Breaking change 1
- Breaking change 2
```

### 3. Pre-release Tags
- `-alpha`: Early development
- `-beta`: Feature complete
- `-rc`: Release candidate

## Deployment Process

### 1. Production Release
```bash
# Create release branch
git checkout -b release/v1.0.0

# Update version
npm version 1.0.0

# Create tag
git tag -a v1.0.0 -m "Release v1.0.0"

# Push changes
git push origin release/v1.0.0
git push origin v1.0.0
```

### 2. Pre-release
```bash
# Create pre-release branch
git checkout -b release/v1.0.0-beta.1

# Update version
npm version 1.0.0-beta.1

# Create tag
git tag -a v1.0.0-beta.1 -m "Beta v1.0.0-beta.1"

# Push changes
git push origin release/v1.0.0-beta.1
git push origin v1.0.0-beta.1
```

## Version Management

### 1. Package Version
```json
{
  "version": "1.0.0",
  "scripts": {
    "version": "npm run build && git add -A dist",
    "postversion": "git push && git push --tags"
  }
}
```

### 2. Changelog Format
```markdown
# Changelog

## [1.0.0] - 2023-01-01

### Added
- Feature 1
- Feature 2

### Changed
- Change 1
- Change 2

### Fixed
- Bug fix 1
- Bug fix 2

### Breaking Changes
- Breaking change 1
- Breaking change 2
```

## Release Notes

### 1. Template
```markdown
# Release v1.0.0

## Highlights
- Major feature 1
- Major feature 2

## New Features
- Feature 1
- Feature 2

## Improvements
- Improvement 1
- Improvement 2

## Bug Fixes
- Bug fix 1
- Bug fix 2

## Breaking Changes
- Breaking change 1
- Breaking change 2

## Upgrade Guide
1. Step 1
2. Step 2
3. Step 3
```

### 2. Distribution
- GitHub Releases
- Email announcement
- Blog post
- Social media
- Newsletter

## Rollback Procedure

### 1. Emergency Rollback
```bash
# Revert to previous version
git checkout v0.9.0

# Force push
git push -f origin main

# Delete problematic tag
git tag -d v1.0.0
git push origin :refs/tags/v1.0.0
```

### 2. Database Rollback
```bash
# Revert last migration
npm run db:rollback

# Verify database state
npm run db:status
```

### 3. Post-rollback
- [ ] Notify team
- [ ] Update status page
- [ ] Document incident
- [ ] Schedule post-mortem
- [ ] Plan fix deployment 