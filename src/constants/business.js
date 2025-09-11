// 지역 코드 매핑
export const REGION_OPTIONS = [
  { value: 11, label: '서울특별시' },
  { value: 26, label: '부산광역시' },
  { value: 27, label: '대구광역시' },
  { value: 28, label: '인천광역시' },
  { value: 29, label: '광주광역시' },
  { value: 30, label: '대전광역시' },
  { value: 31, label: '울산광역시' },
  { value: 41, label: '경기도' },
  { value: 42, label: '강원도' },
  { value: 43, label: '충청북도' },
  { value: 44, label: '충청남도' },
  { value: 45, label: '전라북도' },
  { value: 46, label: '전라남도' },
  { value: 47, label: '경상북도' },
  { value: 48, label: '경상남도' },
  { value: 50, label: '제주특별자치도' },
];

// 업종 코드 매핑
export const INDUSTRY_OPTIONS = [
  { value: 1, label: '농업, 임업 및 어업' },
  { value: 2, label: '광업' },
  { value: 3, label: '제조업' },
  { value: 4, label: '전기, 가스, 증기 및 공기조절 공급업' },
  { value: 5, label: '수도, 하수, 폐기물 처리, 원료 재생업' },
  { value: 6, label: '건설업' },
  { value: 7, label: '도소매업' },
  { value: 8, label: '운수 및 창고업' },
  { value: 9, label: '숙박 및 음식점업' },
  { value: 10, label: '정보통신업' },
  { value: 11, label: '금융 및 보험업' },
  { value: 12, label: '부동산업' },
  { value: 13, label: '전문, 과학 및 기술 서비스업' },
  { value: 14, label: '사업시설관리, 사업지원 및 임대 서비스업' },
  { value: 15, label: '공공행정, 국방 및 사회보장행정' },
  { value: 16, label: '교육서비스업' },
  { value: 17, label: '보건업 및 사회복지 서비스업' },
  { value: 18, label: '예술, 스포츠 및 여가관련 서비스업' },
  { value: 19, label: '협회 및 단체, 수리 및 기타 개인 서비스업' },
];

// 지역 ID로 지역명 찾기
export const getRegionName = regionId => {
  const region = REGION_OPTIONS.find(
    option => option.value === Math.floor(regionId / 1000)
  );
  return region ? region.label : '알 수 없는 지역';
};

// 업종 ID로 업종명 찾기
export const getIndustryName = industryId => {
  const industry = INDUSTRY_OPTIONS.find(option => option.value === industryId);
  return industry ? industry.label : '알 수 없는 업종';
};
