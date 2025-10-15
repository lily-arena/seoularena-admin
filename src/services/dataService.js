// src/services/dataService.js

import { db, doc, setDoc } from "../firebase"; // 1단계에서 만든 파일 경로

// 공사 현황 이미지 URL을 Firestore에 저장하는 함수
export const updateConstructionImage = async (imageUrl) => {
    try {
        // settings 컬렉션의 'current' 문서에 데이터를 저장/덮어씁니다.
        const settingsRef = doc(db, "settings", "current");
        await setDoc(settingsRef, {
            construction_image_url: imageUrl,
            last_updated: new Date() // 마지막 업데이트 시간 기록
        }, { merge: true }); // merge: true를 사용하여 기존 필드는 유지하고 이 필드만 업데이트

        console.log("Construction image URL successfully updated!");
        return true;
    } catch (e) {
        console.error("Error updating document: ", e);
        return false;
    }
};