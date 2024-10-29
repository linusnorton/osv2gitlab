# osv2gitlab

Script to convert [osv-scanner](https://www.osv.dev) output to a GitLab [dependency scanner report format](https://docs.gitlab.com/ee/development/integrations/secure.html).

## Usage

```bash
$ osv-scanner --format json | npx -q osv2gitlab > gl-dependency-scanning.json
```

## Contributing

Please fork the repository and submit a pull request.

## License

This software is licensed under [GNU GPLv3](https://www.gnu.org/licenses/gpl-3.0.en.html).
