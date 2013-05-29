# keyset

Simple tool to help rotate keys in a suite of cooperating Heroku apps.

## Config

Put a file like this at `~/.keyset.json`, or it won't work.

```json
{
  "secretKeyName": "HEROKU_CONFIG_NAME_FOR_SECRET_KEY",
  "envs": {
    "test": {
      "auth": "myauth-test",
      "apps": [
        "myauth-test",
        "myweb-test",
        "myapi-test"
      ]
    },
    "prod": {
      "auth": "myauth-prod",
      "apps": [
        "myauth-prod",
        "myweb-prod",
        "myapi-prod"
      ]
    }
  }
}
```

## License

MIT.
