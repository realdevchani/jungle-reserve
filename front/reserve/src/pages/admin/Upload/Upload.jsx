import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import S from "./style";

const Upload = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("adminToken")) {
      navigate("/admin/login");
    }
  }, [navigate]);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;
    setFile(selected);
    setPreview(null);
  };

  const handlePreview = async () => {
    if (!file) {
      alert("파일을 선택해주세요.");
      return;
    }

    const token = localStorage.getItem("adminToken");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/admin/users/upload?preview=true`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );
      if (res.ok) {
        const data = await res.json();
        setPreview(data.data);
      } else {
        alert("파일 파싱에 실패했습니다.");
      }
    } catch (err) {
      console.error(err);
      alert("서버에 연결할 수 없습니다.");
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);

    const token = localStorage.getItem("adminToken");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/admin/users/upload`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );
      if (res.ok) {
        const data = await res.json();
        alert(`${data.data.count}명이 등록되었습니다.`);
        navigate("/admin/users");
      } else {
        alert("업로드에 실패했습니다.");
      }
    } catch (err) {
      console.error(err);
      alert("서버에 연결할 수 없습니다.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <S.Wrap>
      <S.BackButton onClick={() => navigate("/admin/users")}>← 학생 관리</S.BackButton>
      <S.Title>엑셀 업로드</S.Title>
      <S.Desc>
        학생 명단 엑셀 파일을 업로드하면 이름, 전화번호를 자동으로 파싱합니다.
      </S.Desc>

      <S.FileArea>
        <S.FileInput
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileChange}
          id="excel-upload"
        />
        <S.FileLabel htmlFor="excel-upload">
          {file ? file.name : "엑셀 파일 선택 (.xlsx, .xls)"}
        </S.FileLabel>
        <S.PreviewButton onClick={handlePreview} disabled={!file}>
          미리보기
        </S.PreviewButton>
      </S.FileArea>

      {preview && (
        <>
          <S.PreviewTitle>미리보기 ({preview.length}명)</S.PreviewTitle>
          <S.Table>
            <S.Thead>
              <tr>
                <S.Th>이름</S.Th>
                <S.Th>전화번호</S.Th>
                <S.Th>상태</S.Th>
              </tr>
            </S.Thead>
            <tbody>
              {preview.map((row, i) => (
                <tr key={i}>
                  <S.Td>{row.name}</S.Td>
                  <S.Td>{row.phone}</S.Td>
                  <S.Td>
                    <S.StatusTag $isNew={row.isNew}>
                      {row.isNew ? "신규" : "기존"}
                    </S.StatusTag>
                  </S.Td>
                </tr>
              ))}
            </tbody>
          </S.Table>

          <S.SubmitButton onClick={handleUpload} disabled={uploading}>
            {uploading ? "등록 중..." : `${preview.length}명 등록하기`}
          </S.SubmitButton>
        </>
      )}
    </S.Wrap>
  );
};

export default Upload;
