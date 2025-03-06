'use client';

import Quill, { QuillOptionsStatic } from 'quill';
import 'quill/dist/quill.snow.css';
import React, { useRef } from 'react';

interface EmailEditorProps {
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
  onReady?: (quill: Quill) => void;
}

const EmailEditor: React.FC<EmailEditorProps> = ({
  value,
  onChange,
  readOnly = false,
  onReady,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<Quill | null>(null);

  React.useEffect(() => {
    if (!editorRef.current || quillRef.current) return;

    const quill = new Quill(editorRef.current, {
      theme: 'snow',
      readOnly,
      modules: {
        toolbar: [
          [{ size: ['small', false, 'large', 'huge'] }],
          [{ header: [1, 2, 3, false] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ color: [] }, { background: [] }],
          [{ align: [] }],
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['clean'],
        ],
        history: {
          delay: 1000,
          maxStack: 100,
          userOnly: true,
        },
      },
    } as QuillOptionsStatic);

    quillRef.current = quill;
    quill.root.innerHTML = value;

    if (onReady) {
      onReady(quill);
    }

    const textChangeHandler = () => {
      onChange(quill.root.innerHTML);
    };

    quill.on('text-change', textChangeHandler);

    return () => {
      quill.off('text-change', textChangeHandler);
    };
  }, [onChange, readOnly, value, onReady]);

  // value prop이 변경될 때 에디터 내용 업데이트
  React.useEffect(() => {
    if (
      quillRef.current &&
      quillRef.current.root.innerHTML !== value
    ) {
      quillRef.current.root.innerHTML = value;
    }
  }, [value]);

  return (
    <div
      ref={editorRef}
      className='h-[160px] [&_.ql-editor]:h-[350px]'
    />
  );
};

export default EmailEditor;
