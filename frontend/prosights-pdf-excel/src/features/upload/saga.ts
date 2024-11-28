import { takeEvery, call, put } from "redux-saga/effects";
import { startUpload, uploadSuccess, uploadFailure, updateDocumentId } from "./reducer";
import { uploadPDF } from "../../features/upload/api";

function* handleUpload(action: {
  type: string;
  payload: { id: string, file: File; fields: string[]; columnDefs: any, userId: string };
}): Generator {
  const { id, file, fields, columnDefs, userId } = action.payload;
  console.log("handleUpload", userId);
  try {
    const response: { document_id: string; result: { data: [] } } = yield call(
      uploadPDF,
      file,
      fields,
      columnDefs,
      userId
    );
    const results = response.result?.data || [];
    yield put(uploadSuccess({ id, results }));
    if (response.document_id) {
        yield put(updateDocumentId({ tempId: id, documentId: response.document_id }));
      }
  } catch (error: any) {
    console.error(error);
    yield put(uploadFailure({ id, error: error.message }));
  }
}

export default function* uploadSaga(): Generator {
  yield takeEvery(startUpload.type, handleUpload);
}
