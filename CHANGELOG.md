# Changelog

## [2.1.3](https://github.com/innovation-system/node-bacnet/compare/v2.1.2...v2.1.3) (2025-06-25)


### Bug Fixes

* **dates:** fixes off-by-one error when encoding/decoding the month component of dates ([#38](https://github.com/innovation-system/node-bacnet/issues/38)) ([4ad1c19](https://github.com/innovation-system/node-bacnet/commit/4ad1c1996654dc39425e9838a80ccd1727e27b94))

## [2.1.2](https://github.com/innovation-system/node-bacnet/compare/v2.1.1...v2.1.2) (2025-06-24)


### Bug Fixes

* **docs:** exclude test files from documentation generation ([cd4fc00](https://github.com/innovation-system/node-bacnet/commit/cd4fc005114ae4de62d599f52a9f7f4ea74b85ba))
* **docs:** update documentation generation command to exclude test files ([#37](https://github.com/innovation-system/node-bacnet/issues/37)) ([5b5733a](https://github.com/innovation-system/node-bacnet/commit/5b5733ae7fe3002135408571eb36662e3b81c94e))

## [2.1.1](https://github.com/innovation-system/node-bacnet/compare/v2.1.0...v2.1.1) (2025-06-24)


### Bug Fixes

* **bitstrings:** refactor to use arrays of bytes rather than arrays of bits ([#36](https://github.com/innovation-system/node-bacnet/issues/36)) ([718e8b4](https://github.com/innovation-system/node-bacnet/commit/718e8b4dd93fc32c9a996109436a545078ec22e5))

# [2.1.0](https://github.com/innovation-system/node-bacnet/compare/v2.0.1...v2.1.0) (2025-06-19)


### Features

* **types:** scaffolding for stronger typing of ApplicationData values ([#35](https://github.com/innovation-system/node-bacnet/issues/35)) ([733c02c](https://github.com/innovation-system/node-bacnet/commit/733c02c7eea8c1a4b97dcce2557fb56ced873fbc))

## [2.0.1](https://github.com/innovation-system/node-bacnet/compare/v2.0.0...v2.0.1) (2025-06-17)

# [2.0.0](https://github.com/innovation-system/node-bacnet/compare/v1.3.1...v2.0.0) (2025-06-16)

## [1.3.1](https://github.com/innovation-system/node-bacnet/compare/v1.3.0...v1.3.1) (2025-06-13)


### Bug Fixes

* **GetEventInformation:** decoding error ERR_OUT_OF_RANGE if object identifier is not provided ([#33](https://github.com/innovation-system/node-bacnet/issues/33)) ([193b728](https://github.com/innovation-system/node-bacnet/commit/193b7283a0228ee1591a9dcdba51b9bea15e4b64))

# [1.3.0](https://github.com/innovation-system/node-bacnet/compare/v1.2.0...v1.3.0) (2025-05-12)


### Bug Fixes

* correct numbering in table of contents in README ([4afd05c](https://github.com/innovation-system/node-bacnet/commit/4afd05caf2d1b5e8825b06bee67ae8fa0a5f1f34))
* remove duplicate header in README ([af1e65c](https://github.com/innovation-system/node-bacnet/commit/af1e65c3798346734685688c2352a77590bc39e6))
* update documentation generation command to use npm script ([f20b6da](https://github.com/innovation-system/node-bacnet/commit/f20b6da891665c9a7afd919e2422702aa4badfd9))


### Features

* add GitHub Actions workflow for TypeScript documentation deployment ([#29](https://github.com/innovation-system/node-bacnet/issues/29)) ([6680172](https://github.com/innovation-system/node-bacnet/commit/6680172006264d9a2d8e535210b9c8ffbff5fd07))
* add missing types ([#30](https://github.com/innovation-system/node-bacnet/issues/30)) ([89d3929](https://github.com/innovation-system/node-bacnet/commit/89d392917d14b9fa5c8a7556d64f61f2a3da0202))

# [1.2.0](https://github.com/innovation-system/node-bacnet/compare/v1.1.0...v1.2.0) (2025-05-09)


### Features

* add BACnet device emulator ([#24](https://github.com/innovation-system/node-bacnet/issues/24)) ([85b0f70](https://github.com/innovation-system/node-bacnet/commit/85b0f701e016752f4897030aded36ec35a40aee2))
* add examples ([#25](https://github.com/innovation-system/node-bacnet/issues/25)) ([fa86561](https://github.com/innovation-system/node-bacnet/commit/fa8656194f381736fb918f6ef0036f97232046fe))

# [1.1.0](https://github.com/innovation-system/node-bacnet/compare/v1.0.3...v1.1.0) (2025-05-05)


### Bug Fixes

* add sleep command to ensure containers are fully up before running tests ([#19](https://github.com/innovation-system/node-bacnet/issues/19)) ([a2a58f3](https://github.com/innovation-system/node-bacnet/commit/a2a58f379eb05fe5f89e0548fba0f3d627fdf095))


### Features

* add docker containerization and test compliance ([#16](https://github.com/innovation-system/node-bacnet/issues/16)) ([438ae42](https://github.com/innovation-system/node-bacnet/commit/438ae42d868406451c9237dfa07a4bec7da7f025))
* add types to events ([48b698c](https://github.com/innovation-system/node-bacnet/commit/48b698c62b2ddd02c07640a91b39fb3a72a47eaa))

## [1.0.3](https://github.com/innovation-system/node-bacnet/compare/v1.0.2...v1.0.3) (2025-04-28)

## [1.0.2](https://github.com/innovation-system/node-bacnet/compare/v1.0.1...v1.0.2) (2025-04-23)


### Bug Fixes

* add missing unconfirmed covNotify and UTC timeSync exports ([#14](https://github.com/innovation-system/node-bacnet/issues/14)) ([8b680a2](https://github.com/innovation-system/node-bacnet/commit/8b680a2a5da4e2aa842208ca337b973e1ddb997f))

## [1.0.1](https://github.com/innovation-system/node-bacnet/compare/v1.0.0...v1.0.1) (2025-04-23)


### Bug Fixes

* export enums directly and improve type safety in invert function ([c26e148](https://github.com/innovation-system/node-bacnet/commit/c26e148b94035f388d4dc1bcf33f1beb5229c603))

# [1.0.0](https://github.com/innovation-system/node-bacnet/compare/v1.0.0-beta.3...v1.0.0) (2025-04-23)


### Features

* sync missing commits ([#10](https://github.com/innovation-system/node-bacnet/issues/10)) ([a11f245](https://github.com/innovation-system/node-bacnet/commit/a11f245435ae4dbb1e730491b40037eb0d9b7ccd))

# [1.0.0-beta.3](https://github.com/innovation-system/node-bacnet/compare/v1.0.0-beta.2...v1.0.0-beta.3) (2025-04-16)
