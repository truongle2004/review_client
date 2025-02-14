import ReactQuill from 'react-quill-new';

export interface TextEditorProps {
  field: string;
  labelText?: string;
  defaultValue?: string;
  error?: string;
  setValue: (_value: string) => void;
}

const myColors = ['purple', '#785412', '#452632', '#856325', '#963254', '#254563', 'white'];
const modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ align: ['right', 'center', 'justify'] }],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link', 'image'],
    [{ color: myColors }],
    [{ background: myColors }],
  ],
};

const formats = [
  'header',
  'bold',
  'italic',
  'underline',
  'strike',
  'blockquote',
  'list',
  'bullet',
  'link',
  'color',
  'image',
  'background',
  'align',
];

export default function TextEditor({
  field,
  labelText,
  defaultValue,
  error,
  setValue,
}: TextEditorProps) {
  const handleChangeValue = (value: string) => {
    setValue(value);
  };

  return (
    <div className="mb-3">
      <label className="form-label" htmlFor={field}>
        {labelText}
      </label>
      <ReactQuill
        className="text-editor"
        theme="snow"
        modules={modules}
        formats={formats}
        defaultValue={defaultValue}
        onChange={handleChangeValue}
      />
      <p className="error-field mt-1">{error}</p>
    </div>
  );
}
