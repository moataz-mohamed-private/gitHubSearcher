import githubLogo from "@/assets/github-logo.svg";
import classes from "./styles.module.scss";

export const GithubHeader = () => {
  return (
    <section className={classes.header}>
      <img src={githubLogo}></img>
      <div className={classes.headerInfo}>
        <h1>GitHub Searcher</h1>
        <p>Search users or repositories below</p>
      </div>
    </section>
  );
};
