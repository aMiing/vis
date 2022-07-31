import GMessageBox from 'element-ui/lib/message-box';
import merge from 'element-ui/lib/utils/merge';

GMessageBox.confirm = (message, title, options = {}) => {
  if (typeof title === 'object' && title != null) {
    options = title;
    title = '';
  } else if (title === undefined) {
    title = '';
  }

  if (typeof message === 'object' && message != null) {
    options.dangerouslyUseHTMLString = true;
    message = `${message.title}<div class="el-message-box__desc">${message.desc}</div>`;
  }

  if (options.customClass) {
    options.customClass += ' --confirm';
  } else {
    options.customClass = '--confirm';
  }

  return GMessageBox(
    merge(
      {
        title: title,
        message: message,
        $type: 'confirm',
        showCancelButton: true,
      },
      options
    )
  );
};

export default GMessageBox;
export { GMessageBox };
