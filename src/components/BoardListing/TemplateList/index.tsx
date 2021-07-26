import React from 'react';

import BoardListItem from '../BoardListItem';
import { TableIcon } from '../../Icons';
import styles from './TemplateList.module.css';
import TemplateListItem from '../TemplateListItem';

interface TemplateListProps {
  templates: any[];
  showModal: () => void;
  setTemplateId: (id: string) => void;
}

export default function TemplateListProps({
  templates,
  showModal,
  setTemplateId,
}: TemplateListProps) {
  function onClickHandler(templateId: string) {
    setTemplateId(templateId);
    showModal();
  }

  return (
    <div className={styles.boardsHolder}>
      <div className={styles.boardsSection}>
        <div className={styles.boardsHeader}>
          <TableIcon />
          <h3 className={styles.boardsTitle}>Templates</h3>
        </div>
        <div className={styles.boardsList}>
          {templates.map((template) => (
            <TemplateListItem
              key={template.id}
              title={template.title}
              listsLength={template.lists.length}
              cardsLength={template.cards.length}
              onClick={() => onClickHandler(template.templateId)}
              color={`rgb(${Math.random() * 255},${Math.random() * 255},${
                Math.random() * 255
              })`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
