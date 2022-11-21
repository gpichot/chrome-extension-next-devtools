const assetName = "NextJS-DevTools.zip";
module.exports = {
  branches: ["main"],
  repositoryUrl: "https://github.com/gpichot/chrome-extension-next-devtools",
  plugins: [
    "@semantic-release/changelog",
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    "@semantic-release/npm",
    [
      "@semantic-release/git",
      {
        assets: ["CHANGELOG.md", "package.json", "yarn.lock"],
        message:
          "chore(release): ${nextRelease.version} [publish]\n\n${nextRelease.notes}",
      },
    ],
    [
      "semantic-release-chrome",
      {
        asset: assetName,
      },
    ],
    [
      "@semantic-release/github",
      {
        assets: [
          {
            path: assetName,
            name: "NextJS-DevTools-${nextRelease.version}.zip",
            label: "NextJS DevTools ${nextRelease.version} Chrome Extension",
          },
        ],
      },
    ],
  ],
  publish: ["@semantic-release/github"],
  verifyConditions: [
    "@semantic-release/changelog",
    "@semantic-release/npm",
    "@semantic-release/github",
    "@semantic-release/git",
  ],
};
