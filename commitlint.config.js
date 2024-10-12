module.exports = {
  extends: ["@commitlint/cli", "@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "feat", // if you added any features
        "fix", // if you fix any bug/issue
        "docs", // if make any changes in docs
        "style", // if make any changes in css
        "refactor", // for refactorying in code
        "perf", // imporved any performance
        "test", // add any test cases
        "build", // change sin build
        "ci", // for ci-cd
        "chore", // any dependency changes
        "revert", // revert the changes
      ],
    ],
    "subject-case": [2, "always", "sentence-case"],
  },
};
