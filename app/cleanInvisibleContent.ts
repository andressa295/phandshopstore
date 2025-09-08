// app/cleanInvisibleContent.ts
import React, { ReactNode, ReactElement } from 'react';

export function cleanInvisibleContent(content: ReactNode): ReactNode {
  if (content === null || content === undefined) return null;

  // Se for string apenas com espaços ou &nbsp;
  if (typeof content === 'string') {
    const cleaned = content.replace(/&nbsp;|\s+/g, '');
    return cleaned ? content : null;
  }

  // Se for array (children)
  if (Array.isArray(content)) {
    const cleanedArray = content
      .map(cleanInvisibleContent)
      .filter(Boolean); // remove nulos
    return cleanedArray.length ? cleanedArray : null;
  }

  // Se for React element
  if (React.isValidElement(content)) {
    const element = content as ReactElement<any>; // força tipagem
    const cleanedProps = {
      ...element.props,
      children: cleanInvisibleContent(element.props.children),
    };
    return React.cloneElement(element, cleanedProps);
  }

  // Qualquer outro tipo (número, boolean) retorna normalmente
  return content;
}
