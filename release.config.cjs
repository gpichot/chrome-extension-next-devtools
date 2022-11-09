module.exports = {
  branches: ["main"],
  repositoryUrl: "https://github.com/gpichot/chrome-extension-next-devtools",
  plugins: [
    "@semantic-release/changelog",
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    "@semantic-release/npm",
    "@semantic-release/github",
    //     [
    //       "@semantic-release/git",
    //       {
    //         assets: ["CHANGELOG.md", "package.json", "yarn.lock"],
    //         message:
    //           "chore(release): ${nextRelease.version} [publish]\n\n${nextRelease.notes}",
    //       },
    //     ],
  ],
  publish: ["@semantic-release/github"],
};
