/** Small status message with an optional action button (used for "Undo"). */
export function createToast(element) {
  let timer;

  const hide = () => {
    clearTimeout(timer);
    element.hidden = true;
    element.replaceChildren();
  };

  const show = (message, { actionLabel, onAction, duration = 6000 } = {}) => {
    clearTimeout(timer);
    element.replaceChildren();

    const text = document.createElement('span');
    text.textContent = message;
    element.append(text);

    if (actionLabel) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'toast__action';
      button.textContent = actionLabel;
      button.addEventListener('click', () => {
        onAction?.();
        hide();
      });
      element.append(button);
    }

    element.hidden = false;
    timer = setTimeout(hide, duration);
  };

  return { show, hide };
}
