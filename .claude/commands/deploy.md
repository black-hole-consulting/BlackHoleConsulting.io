# Deploy to Production

Full deployment workflow to AWS S3 + CloudFront.

## Steps

1. **Run all checks first**:
   - `npm run lint`
   - `npm run format:check`
   - `npm run build`
   - `npm run test`

2. **If all checks pass**, commit any pending changes with a descriptive message.

3. **Push to main branch**: `git push`

4. **Monitor deployment**:
   - GitHub Actions will run the CI/CD pipeline
   - Slack notification will confirm success/failure
   - Site URL: https://blkhole.fr

Do NOT proceed with push if any check fails. Fix issues first.
