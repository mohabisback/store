//@ts-ignore

import React from 'react';
import { Link } from 'react-router-dom';
import UploadDS from '../../services/axios/uploadDS';
const Upload = () => {
  const [fileList, setFileList] = React.useState<FileList|null>(null);
  const [select, setSelect] = React.useState('2');

  const handleSubmit = (ev:React.FormEvent<HTMLFormElement>|React.MouseEvent<HTMLInputElement, MouseEvent>) => {
    ev.preventDefault();
    !fileList ? (
      <></>
    ) : (
      Array.from(fileList).forEach((file) => {
        const imageType = /image.*/;
        if (!file.type.match(imageType)) return;

        const formData = new FormData();
        formData.append('file', file);
        switch (select) {
          case '1':
            UploadDS.uploadToServer(formData, file.name).then();
            break;
          case '2':
            UploadDS.uploadToMongo(formData, file.name).then();
            break;
          default:
            break;
        }
      })
    );
  };

  return (
    <div id='upload'>
      <form
        className='upload-form'
        action='/upload'
        method='POST'
        encType='multipart/form-data'
        onSubmit={handleSubmit}
      >
        <input
          id='input-files'
          type='file'
          name='upfile'
          accept='image/*'
          multiple
          onChange={(ev) => {
            setFileList((fileList) => {
              const dt = new DataTransfer();
              if (fileList && fileList.length) {
                const oldFilesArr = Array.from(fileList);
                oldFilesArr.forEach((file) => {
                  dt.items.add(file);
                });
              }
              const newFilesArr = (ev.target.files) ? Array.from(ev.target.files):[];
              newFilesArr.forEach((file) => {
                dt.items.add(file);
              });
              return dt.files;
            });
          }}
        />
        <label>
          Upload to?
          <select
            className='form-select'
            placeholder=''
            name='select'
            onChange={(e) => {
              setSelect(e.target.value);
            }}
            value={select}
          >
            <option value='1'>--Server--</option>
            <option value='2'>--MongoDB-</option>
          </select>
        </label>
        <input
          id='button-files'
          type='submit'
          onClick={handleSubmit}
          value='Submit'
        />
      </form>
      <div id='preview'>
        {!fileList ? (
          <></>
        ) : (
          Array.from(fileList).map((file, i) => {
            return (
              <div style={{ width: '20%', display: 'inline-block' }}>
                <img
                  alt=''
                  key='i'
                  src={URL.createObjectURL(file)}
                  style={{ display: 'block' }}
                />
                <button
                  type='button'
                  style={{ display: 'block' }}
                  onClick={(e) => {
                    setFileList((fileList) => {
                      const newFilesArr = Array.from((fileList ? fileList : [])).filter((item) => item !== file);
                      const dt = new DataTransfer();
                      newFilesArr.forEach((file) => {
                        dt.items.add(file);
                      });
                      return dt.files;
                    });
                  }}
                >
                  Delete
                </button>
              </div>
            );
          })
        )}
      </div>
      <Link to='/'>Back home</Link>
    </div>
  );
  /*
      

    */
};

export default Upload;

