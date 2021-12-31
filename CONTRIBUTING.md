# Please create pull requests from a fork

Although preliminary setup, certain hotfixes, and a small category of other
changes will at times be done directly to the default branch, for the most part
we should maintain a workflow that is amenable to collaboration. If we do our best
to follow our ever-evolving but well-defined workflow, then we will have a solid system for 
smoothly managing all manner of changes.

The main goal is to make sure the `master` branch only has the version of the application
that should be considered the primary or main version, the "production" version if you will.
Other branches will have many kinds of variations, mostly consisting of changes that
we want to get into the main version of the project.

The branches on which we develop these changes should be in copies of the repo that are
in our personal namespace. These are typically called "forks". See Atlassian's
guide on the [Forking Workflow](https://www.atlassian.com/git/tutorials/comparing-workflows/forking-workflow) for git.

The branches in the upstream repo should pertain to integrating/testing these changes. It should not have
so many feature, hot-fix, etc. branches. Those should mostly, if not primarily, come form forks. This way,
the upstream repo will be kept a lot more clean with branches that more directly pertain to accepted changes.

To contribute to this project, simply do the following:

* Fork this project into your personal namespace.
* Create a branch based off `master`: `git checkout -b feature-scoreboard master`
* When you have this branch in a state that is ready to share, please create
  a pull request so that the maintainers can review.
* If everything checks out, then expect the pull request to be accepted. 