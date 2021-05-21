import { CloseIcon } from '../../Icons';
import styles from './formatinghelp.module.css';

interface FormatingHelp {
  closeHelperHandler: () => void;
}

function FormatingHelp({ closeHelperHandler }) {
  return (
    <div className={styles.popOver}>
      <div className={styles.header}>
        <span>Formatting help</span>
        <button
          className={styles.closeButton}
          type="button"
          aria-label="Close"
          onClick={closeHelperHandler}>
          <CloseIcon />
        </button>
      </div>
      <div className={styles.body}>
        <p>
          <b>Not</b> trello uses Markdown for formatting. See the{' '}
          <a
            href="http://help.trello.com/article/821-using-markdown-in-trello"
            target="_blank">
            Trello syntax
          </a>
          .
        </p>
        <hr />
        <p>First Level Header</p>
        <code>
          Making Scrambled Eggs: A Primer
          <br />
          ===============================
        </code>
        <hr />
        <p>Second Level Header</p>
        <code>
          1.1: Preparation
          <br />
          ----------------
        </code>
        <hr />
        <p>Paragraphs</p>
        <code>
          Add two new lines to start a new paragraph. Crack two eggs into the
          bowl and whisk.
        </code>
        <hr />
        <p>Bold</p>
        <code>**Carefully** crack the eggs.</code>
        <hr />
        <p>Emphasis</p>
        <code>Whisk the eggs *vigorously*.</code>
        <hr />
        <p>Lists</p>
        <code>
          Ingredients:
          <br />
          <br />- Eggs
          <br />- Oil
          <br />- *Optional:* milk
        </code>
        <hr />
        <p>Links</p>
        <code>
          To download a PDF version of the recipe, [click
          here](https://example.com/scrambled-eggs.pdf).
        </code>
        <hr />
        <p>Images</p>
        <code>![The Finished Dish](https://example.com/eggs.png)</code>
      </div>
    </div>
  );
}
export default FormatingHelp;
