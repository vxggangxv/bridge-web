function MyDropzone() {
  const onDrop = useCallback(async acceptedFiles => {
    // 사용자가 올린 정보를 확인해야 하므로 일단 서버로 전송합니다.
    // 제목 같은 건 폼을 제출한 이후에 달아주도록 합시다.

    // 폼데이터 구성
    const formData = new FormData();
    const config = {
      header: {
        'content-type': 'multipart/form-data',
      },
    };
    formData.append('file', acceptedFiles[0]);
    console.log(acceptedFiles[0]);

    // 배포시에는 지워줘야 합니다.
    axios.defaults.baseURL = 'http://localhost:5000/';
    await axios.post('/api/image/upload', formData, config).then(res => {
      console.log(res);
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const InputProps = {
    ...getInputProps(),
    multiple: false,
    accept: 'image/gif, image/jpg, image/jpeg',
  };

  const RootProps = {
    ...getRootProps(),
  };

  return (
    <DropZone {...RootProps} maxSize={100} multiple={false}>
      <input {...InputProps} />
      {isDragActive ? (
        <p>이제 이미지를 놓아주세요</p>
      ) : (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <div style={{ fontSize: '3em', marginBottom: '5px' }}>
            <i className="fas fa-file-upload"></i>
          </div>
          <div>이미지 드랍 or 클릭</div>
        </div>
      )}
    </DropZone>
  );
}

// const files = Array.from(e.target.files);
// Promise.all(files.map(file => {
//   return (new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     const readerId = uuid();
//     reader.addEventListener('load', (ev) => { resolve({ url: ev.target.result, reader, id: readerId ,file:file}) });
//     reader.addEventListener('error', reject);
//     reader.readAsDataURL(file);
//   }));
// }))
//   .then(images => {
//     setValues(draft => {
//       draft.files = images;
//       draft.images = images.map(item => item.url);
//     });
//   }, err => {
//     console.error(err);
//   });
