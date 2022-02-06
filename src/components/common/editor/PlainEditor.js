import React, { useRef } from 'react';
import _ from 'lodash';
import styled from 'styled-components';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useImmer } from 'use-immer';
import { color, font } from 'styles/utils';
import { parseValue } from 'lib/library';
import { useDidUpdateEffect, usePrevious } from 'lib/utils';

// NOTE: 사용법
/**
 * <PlainEditor 
    maxLength={5000}
    height={300}
    onBlur={(value)=>handleBlur({type:currentType,value})} 
    content={values.modal.value} 
  />
 */

const PlainEditorState = {
  editorHtml: null,
  editorText: null,
  wordCount: 0,
};

// console.log(ReactQuill, 'ReactQuill');
const PlainEditor = React.memo(function PlainEditor(props) {
  const [values, setValues] = useImmer(PlainEditorState);
  const reactQuillRef = useRef(null);
  const prevState = usePrevious(values);
  const {
    view = false,
    readOnly = false,
    content = '',
    onBlur = () => {},
    onChange = () => {},
    style,
    borderRadius,
    height,
    wordCount,
    maxLength = 5000,
    className = '',
    placeHolder = 'Type Something...',
    disableNewLine = false,
    minHeight = 0,
    isCustomBorder = false,
  } = props;
  const MAX_LENGTH = maxLength || 5000;

  const valueseEitorHtml = parseValue(values.editorHtml, content) || '';
  const valueseEitorText = parseValue(values.editorText, content) || '';
  let valuesCount = String(valueseEitorText)
    .trim()
    .replace(/(<([^>]+)>)/gi, '');

  // previousRange, source, editor
  const handleBlur = () => {
    if (!readOnly) {
      const editorHtml = (values.editorHtml || '').replace(/\$&amp;/g, '');
      const editorText = (values.editorText || '').replace(/\$&amp;/g, '');
      onBlur({ data: editorHtml, text: editorText });
    }
  };

  // content, delta, source, editor
  const handleChange = (content, delta, source, editor) => {
    if (reactQuillRef.current) {
      let quill = reactQuillRef.current.getEditor();
      if (editor.getLength() > MAX_LENGTH) {
        quill.deleteText(MAX_LENGTH, quill.getLength());
      }
      let editorHtml = editor.getHTML().replace(/\$&amp;/g, '');
      let editorText = editor.getText().replace(/\$&amp;/g, '');

      if (disableNewLine) {
        if (editorHtml.substr(editorHtml.length - 11) === '<p><br></p>' && editorText.length > 1) {
          editorHtml = editorHtml.replace(/[(\<p\>\<br\>\<\/p\>)]/g, '');
        }
      }

      setValues(draft => {
        draft.editorHtml = editorHtml;
        draft.editorText = editorText;
        draft.wordCount = editorText.trim().length;
      });
    }
  };
  const arrowKeyList = [
    'arrowdown',
    'arrowup',
    'arrowright',
    'arrowleft',
    'backspace',
    'end',
    'home',
  ];
  const handleCheckCharacterCount = event => {
    let quill = reactQuillRef.current.getEditor();
    if (event.key === 'Enter' && quill.getText().length > MAX_LENGTH) {
      setValues(draft => {
        draft.editorHtml = prevState.editorHtml;
      });
    }
    const isArrowKey = arrowKeyList.indexOf(event.key.toLowerCase()) === -1;
    if (quill.getText().length > MAX_LENGTH && isArrowKey) {
      let str = event.key;

      event.preventDefault();
      if (str === 'Process') {
        // 한글 막는 테스팅
        event.stopPropagation();
        console.log('막아보자');
      }
    }
  };

  useDidUpdateEffect(() => {
    const editorHtml = values.editorHtml.replace(/\$&amp;/g, '');
    const editorText = values.editorText.replace(/\$&amp;/g, '');
    reactQuillRef.current.focus();
    onChange({ data: editorHtml, text: editorText });
  }, [values.editorHtml, values.editorText]);

  //#ececec
  return (
    <Styled.PlainEditor
      data-component-name="PlainEditor"
      height={height}
      minHeight={minHeight}
      borderRadius={borderRadius}
      style={{
        ...style,
        // border: !isCustomBorder && `1px solid ${color.gray_border}`,
      }}
      className="plainEditor"
    >
      <div onBlur={handleBlur}>
        <ReactQuill
          onKeyDown={handleCheckCharacterCount}
          // modules={PlainEditor.modules}
          className={className}
          readOnly={readOnly}
          ref={reactQuillRef}
          onChange={handleChange}
          onBlur={handleBlur}
          defaultValue={valueseEitorHtml.trim()}
          value={valueseEitorHtml.trim()}
          theme="snow"
          placeholder={!readOnly ? placeHolder : ''}
          preserveWhitespace={true}
        />
        {wordCount !== false && view === false && (
          <div
            className="wordCount"
            style={{
              border: isCustomBorder && `1px solid ${color.gray_border}`,
              borderTop: isCustomBorder && 'none',
            }}
          >
            {(valuesCount || '').length}/ {MAX_LENGTH}
          </div>
        )}
      </div>
    </Styled.PlainEditor>
  );
});

const Styled = {
  PlainEditor: styled.div`
    width: 100%;
    word-break: break-all;
    .jodit_container,
    .jodit_container .jodit_workplace {
      min-height: auto;
    }
    .ql-editor {
      color: ${color.black_font};
      ${({ minHeight }) => minHeight && `min-height:${minHeight}px `};
      border-width: 1px;
      border-style: solid;
      border-color: rgba(0, 0, 0, 0.23);
      border-radius: ${({ borderRadius }) => (borderRadius ? `${borderRadius}px` : `4px`)};
      &:hover {
        border-color: rgba(0, 0, 0, 0.87);
      }
      &:focus {
        border-color: ${color.blue};
      }
    }
    .jodit_workplace,
    .jodit_statusbar {
      border: 0 !important;
    }
    .jodit_statusbar {
      background: #f7f7f7;
    }
    .jodit_wysiwyg,
    .ql-container.ql-snow {
      ${({ height }) => height && `height:${height}px !important`};
    }
    .ql-container.ql-snow {
      border: 0;
    }
    .ql-toolbar {
      display: none;
    }
    .wordCount {
      text-align: right;
      padding: 5px;
      padding-right: 10px;
      background: #fafafa;
      ${font(12, color.gray_font)};
    }
    .ql-editor.ql-blank::before {
      font-style: normal;
      color: #bbbbbb;
    }
  `,
};

export default PlainEditor;

/*
.ql-editor {
  color: ${color.black_font};
  ${({ minHeight }) => minHeight && `min-height:${minHeight}px `};
  white-space: normal !important;
*/
/* border-width: 1px;
    border-style: solid;
    border-color: rgba(0, 0, 0, 0.23);
    border-radius: ${({ borderRadius }) => (borderRadius ? `${borderRadius}px` : `4px`)};
    &:hover {
      border-color: rgba(0, 0, 0, 0.87);
    }
    &:focus {
      border-color: ${color.blue};
    } */
