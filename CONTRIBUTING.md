# Contributing guidelines

## Before contributing

Welcome to [dada909090/Bedrock-Gametest-Plugin](https://github.com/dada909090/Bedrock-Gametest-Plugin)! Before sending your pull requests,
make sure that you **read the whole guidelines**. If you have any doubt on the contributing guide, please feel free to
[state it clearly in an issue](https://github.com/dada909090/Bedrock-Gametest-Plugin/issues/new).

## Contributing

### Contributor

We are very happy that you consider implementing usage for other users! This repository is
referenced and used by learners from around the globe. Being one of our contributors, you agree and confirm that:

- You did your work - plagiarism is not allowed.
  - Any plagiarized work will not be merged.
  - if you used codes of others, and it is open, you may credit as if you really think you have permissions.
- Your submitted work must fulfill our styles and standards.

**New implementation** is welcome! For example, new solutions to a problem, different representations of a UI
structure or functuon with different complexity.

**Improving comments** xor **Improving Variables** are also highly welcome.

### Contribution

We appreciate any contribution, from fixing grammar mistakes to implementing complex modules. Please read this
section if you are contributing to your work.

If you submit a PR that resolves an open issue, please help us to keep our issue list small by adding
`fixes: #{$ISSUE_NO}` to your commit message. GitHub will use this tag to auto-close the issue if your PR is merged.

### What is Suitable?


#### File Naming Convention

- filenames should use the UpperCamelCase (PascalCase) style, or using lowercase.
- There should be no spaces in filenames.
- **Example:** `UserProfile.js` is allowed but `userprofile.js`,`Userprofile.js`,`user-Profile.js`,`userProfile.js` are
  not.

#### Module System

We use the [ES Module](https://hacks.mozilla.org/2018/03/es-modules-a-cartoon-deep-dive/) system in minecraft bedrock edition gametest module, which bring an official, standardized module system to JavaScript.

It roughly means you will need to use `export` and `import` statements instead of `module.exports` and `require()`.

#### Testing

Be confident that your code works. When was the last time you committed a code change, your build failed, and half of
your app stopped working? Mine was last week. Writing tests for our systems will help us ensure the implementations
are air tight even after multiple fixes and code changes.

It is advised that the module does not contain any "live" code but rather just exports the function(s) in dir "./lib", 
needed to execute the module. Your test code can import those function(s), call them with the appropriate parameters
and inspect the outcome.

Please refrain from using `console` in your implementation, but only test codes.

You can (and should!) test modules that you implement inside game before committing your changes (even if it have zero logic mistake).

#### Coding Style

To maximize the readability and correctness of our code, we require that new submissions follow standard js code style.

no linters config are given, but please make namings good.

A few (but not all) of the things to keep in mind:

- Use camelCase with the leading character as lowercase for identifier names (variables and functions).
- Names start with a letter.

```js
function sumOfArray(numbers) {
  let sum = 0;
  for (let i = 0; i < numbers.length; i++){
    sum += numbers[i];
  }
  return sum;
}
```

- Avoid using global variables and avoid `==`.
- Please use `let` over `var`.
- Please refrain from using `console.log` or any other console methods.
- **Absolutely** don't use `alert`.
- We strongly recommend the use of ECMAScript 6.
- Avoid importing external libraries for basic algorithms. Only use those libraries for complicated algorithms.
- Most importantly:
  - **Be consistent in the use of these guidelines when submitting.**
  - Happy coding!