import { useEffect, useMemo, useState } from "react";
import { supabase } from "./supabase";

const 기본관리항목 = [
  { category: "가전", name: "세탁기", modelNumber: "", asPhone: "", lastRepairDate: "", status: "정상", note: "" },
  { category: "가전", name: "에어컨", modelNumber: "", asPhone: "", lastRepairDate: "", status: "정상", note: "" },
  { category: "가전", name: "TV", modelNumber: "", asPhone: "", lastRepairDate: "", status: "정상", note: "" },
  { category: "가전", name: "냉장고", modelNumber: "", asPhone: "", lastRepairDate: "", status: "정상", note: "" },
  { category: "가전", name: "보일러", modelNumber: "", asPhone: "", lastRepairDate: "", status: "정상", note: "" },
  { category: "가전", name: "렌지후드", modelNumber: "", asPhone: "", lastRepairDate: "", status: "정상", note: "" },
  { category: "가전", name: "환풍기", modelNumber: "", asPhone: "", lastRepairDate: "", status: "정상", note: "" },
  { category: "시설", name: "문 손잡이", modelNumber: "", asPhone: "", lastRepairDate: "", status: "정상", note: "" },
  { category: "시설", name: "세면대 수전", modelNumber: "", asPhone: "", lastRepairDate: "", status: "정상", note: "" },
  { category: "시설", name: "주방 수전", modelNumber: "", asPhone: "", lastRepairDate: "", status: "정상", note: "" },
  { category: "시설", name: "세면대 배수구", modelNumber: "", asPhone: "", lastRepairDate: "", status: "정상", note: "" },
  { category: "시설", name: "양변기", modelNumber: "", asPhone: "", lastRepairDate: "", status: "정상", note: "" },
];

const 초기데이터 = {
  building: { 
    name: "해담빌딩",
    buildYear: "2018",
    address: "부산 해운대구 센텀로 00",
    parkingCount: "6",
    cctvCount: "8",
    buildingType: "필로티",
    imageUrl:
      "https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=1600&q=80",
    summaryText: "총 12개 호실 / 입주 9개 / 공실 3개",
    floors: [
      { floor: "1층", usage: "주차장" },
      { floor: "2층", usage: "원룸" },
      { floor: "3층", usage: "원룸" },
      { floor: "4층", usage: "원룸" },
    ],
  },
  commonCosts: [
    { month: "2026-03", electricity: 150000, water: 80000, commonMaintenance: 120000 },
  ],
  rooms: [
    {
      id: "room-201",
      number: "201호",
      floor: "2층",
      roomType: "1룸",
      status: "입주 중",
      deposit: "500",
      monthlyRent: "45",
      maintenanceFee: "5",
      payDay: "5",
      rentPaid: false,
      tenantName: "김민수",
      tenantPhone: "010-1234-5678",
      moveInDate: "2026-01-05",
      contractEndDate: "2027-01-04",
      note: "조용한 세입자",
      items: 기본관리항목.map((item) =>
        item.name === "에어컨"
          ? { ...item, modelNumber: "AR09B9150HZ", asPhone: "1588-3366", lastRepairDate: "2025-08-02", status: "점검 필요" }
          : item.name === "세탁기"
          ? { ...item, modelNumber: "FG19WN", asPhone: "1544-7777", status: "정상" }
          : item
      ),
      repairs: [
        {
          id: "repair-1",
          repairDate: "2025-08-02",
          itemName: "에어컨",
          category: "가전",
          issue: "냉방 약함",
          detail: "가스 충전 및 필터 청소",
          cost: "80000",
          vendor: "센텀에어컨서비스",
        },
      ],
    },
    {
      id: "room-301",
      number: "301호",
      floor: "3층",
      roomType: "1.5룸",
      status: "공실",
      deposit: "1000",
      monthlyRent: "60",
      maintenanceFee: "7",
      payDay: "10",
      rentPaid: false,
      tenantName: "",
      tenantPhone: "",
      moveInDate: "",
      contractEndDate: "",
      note: "채광 좋음",
      items: 기본관리항목.map((item) => ({ ...item })),
      repairs: [],
    },
  ],
};

function 불러오기() {
  const saved = localStorage.getItem("oneroom-owner-app-v2");
  return saved ? JSON.parse(saved) : 초기데이터;
}

function 저장하기(data) {
  localStorage.setItem("oneroom-owner-app-v2", JSON.stringify(data));
}

function 카드스타일() {
  return {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: 18,
    padding: 16,
    boxShadow: "0 4px 14px rgba(15, 23, 42, 0.05)",
  };
}

function 입력스타일() {
  return {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 12,
    border: "1px solid #d1d5db",
    fontSize: 15,
    boxSizing: "border-box",
    background: "#fff",
  };
}

function 버튼스타일(type = "dark") {
  const map = {
    dark: { background: "#111827", color: "#fff", border: "none" },
    light: { background: "#fff", color: "#111827", border: "1px solid #d1d5db" },
    green: { background: "#16a34a", color: "#fff", border: "none" },
    red: { background: "#dc2626", color: "#fff", border: "none" },
  };
  return {
    ...map[type],
    padding: "12px 14px",
    borderRadius: 12,
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 700,
    minHeight: 44,
  };
}

function 상태배지({ text }) {
  const colorMap = {
    정상: ["#dcfce7", "#166534"],
    "점검 필요": ["#fef3c7", "#92400e"],
    "수리 중": ["#fee2e2", "#991b1b"],
    "교체 필요": ["#e5e7eb", "#374151"],
    "입주 중": ["#dbeafe", "#1d4ed8"],
    공실: ["#f3f4f6", "#4b5563"],
    "납부 완료": ["#dcfce7", "#166534"],
    미납: ["#fee2e2", "#991b1b"],
  };
  const [bg, color] = colorMap[text] || ["#f3f4f6", "#4b5563"];
  return (
    <span
      style={{
        background: bg,
        color,
        padding: "6px 10px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 700,
      }}
    >
      {text}
    </span>
  );
}

function 요약카드({ title, value, sub }) {
  return (
    <div style={카드스타일()}>
      <div style={{ color: "#6b7280", fontSize: 13 }}>{title}</div>
      <div style={{ fontSize: 28, fontWeight: 800, marginTop: 8 }}>{value}</div>
      <div style={{ color: "#9ca3af", fontSize: 12, marginTop: 8 }}>{sub}</div>
    </div>
  );
}

function App() {
  const [data, setData] = useState(불러오기());
  const [currentTab, setCurrentTab] = useState("전체 현황");
  const [buildingName, setBuildingName] = useState('');

  useEffect(() => {
    fetchBuilding()
  }, [])

  const fetchBuilding = async () => {
  try {
    const { data, error } = await supabase
      .from("buildings")
      .select("*")
      .limit(1)

    console.log("buildings data:", data)
    console.log("buildings error:", error)

    if (error) {
      console.error("Supabase error:", error.message)
      return
    }

    if (data && data.length > 0) {
      setBuildingName(data[0].name)
    }
  } catch (err) {
    console.error("fetchBuilding catch:", err)
  }
}
  const [selectedRoomId, setSelectedRoomId] = useState(불러오기().rooms[0]?.id || "");
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("저장 기능이 켜져 있어요. 브라우저를 꺼도 데이터가 남아요.");
  const [newRoomForm, setNewRoomForm] = useState({
    number: "",
    floor: "2층",
    roomType: "1룸",
    deposit: "",
    monthlyRent: "",
    maintenanceFee: "",
    payDay: "",
  });
  const [newRepairForm, setNewRepairForm] = useState({
    repairDate: "",
    itemName: "에어컨",
    category: "가전",
    issue: "",
    detail: "",
    cost: "",
    vendor: "",
  });
  const [newCostForm, setNewCostForm] = useState({ month: "", electricity: "", water: "", commonMaintenance: "" });

  useEffect(() => {
    저장하기(data);
  }, [data]);

  const selectedRoom = data.rooms.find((room) => room.id === selectedRoomId) || data.rooms[0];

  const filteredRooms = data.rooms.filter((room) => {
    const target = `${room.number} ${room.roomType} ${room.tenantName} ${room.status}`.toLowerCase();
    return target.includes(search.toLowerCase());
  });

  const roomsByFloor = {};
  filteredRooms.forEach((room) => {
    if (!roomsByFloor[room.floor]) {
      roomsByFloor[room.floor] = [];
    }
    roomsByFloor[room.floor].push(room);
  });

  const latestCommonCost = data.commonCosts[0];

  const summary = useMemo(() => {
    const total = data.rooms.length;
    const occupied = data.rooms.filter((r) => r.status === "입주 중").length;
    const vacant = data.rooms.filter((r) => r.status === "공실").length;
    const unpaid = data.rooms.filter((r) => r.status === "입주 중" && !r.rentPaid).length;
    const repairs = data.rooms.reduce((sum, room) => sum + room.repairs.length, 0);
    return { total, occupied, vacant, unpaid, repairs };
  }, [data.rooms]);

  function updateBuildingField(field, value) {
    setData((prev) => ({ ...prev, building: { ...prev.building, [field]: value } }));
  }

  function updateFloor(index, field, value) {
    setData((prev) => {
      const nextFloors = [...prev.building.floors];
      nextFloors[index] = { ...nextFloors[index], [field]: value };
      return { ...prev, building: { ...prev.building, floors: nextFloors } };
    });
  }

  function addFloor() {
    setData((prev) => ({
      ...prev,
      building: {
        ...prev.building,
        floors: [...prev.building.floors, { floor: `${prev.building.floors.length + 1}층`, usage: "원룸" }],
      },
    }));
  }

  function removeFloor(index) {
    setData((prev) => ({
      ...prev,
      building: { ...prev.building, floors: prev.building.floors.filter((_, i) => i !== index) },
    }));
  }

  function addRoom() {
    if (!newRoomForm.number.trim()) return;
    const newRoom = {
      id: `room-${Date.now()}`,
      number: newRoomForm.number,
      floor: newRoomForm.floor,
      roomType: newRoomForm.roomType,
      status: "공실",
      deposit: newRoomForm.deposit,
      monthlyRent: newRoomForm.monthlyRent,
      maintenanceFee: newRoomForm.maintenanceFee,
      payDay: newRoomForm.payDay,
      rentPaid: false,
      tenantName: "",
      tenantPhone: "",
      moveInDate: "",
      contractEndDate: "",
      note: "",
      items: 기본관리항목.map((item) => ({ ...item })),
      repairs: [],
    };
    setData((prev) => ({ ...prev, rooms: [...prev.rooms, newRoom] }));
    setSelectedRoomId(newRoom.id);
    setNewRoomForm({ number: "", floor: "2층", roomType: "1룸", deposit: "", monthlyRent: "", maintenanceFee: "", payDay: "" });
    setMessage("새 호실을 추가했어요.");
  }

  function updateRoomField(field, value) {
    setData((prev) => ({
      ...prev,
      rooms: prev.rooms.map((room) => (room.id === selectedRoomId ? { ...room, [field]: value } : room)),
    }));
  }

  function toggleRentPaid() {
    setData((prev) => ({
      ...prev,
      rooms: prev.rooms.map((room) =>
        room.id === selectedRoomId ? { ...room, rentPaid: !room.rentPaid } : room
      ),
    }));
  }

  function updateItem(itemIndex, field, value) {
    setData((prev) => ({
      ...prev,
      rooms: prev.rooms.map((room) => {
        if (room.id !== selectedRoomId) return room;
        const nextItems = [...room.items];
        nextItems[itemIndex] = { ...nextItems[itemIndex], [field]: value };
        return { ...room, items: nextItems };
      }),
    }));
  }

  function addRepair() {
    if (!selectedRoom) return;
    const repair = { id: `repair-${Date.now()}`, ...newRepairForm };
    setData((prev) => ({
      ...prev,
      rooms: prev.rooms.map((room) => {
        if (room.id !== selectedRoomId) return room;
        const nextRepairs = [repair, ...room.repairs];
        const nextItems = room.items.map((item) =>
          item.name === newRepairForm.itemName
            ? { ...item, lastRepairDate: newRepairForm.repairDate, status: "정상" }
            : item
        );
        return { ...room, repairs: nextRepairs, items: nextItems };
      }),
    }));
    setNewRepairForm({ repairDate: "", itemName: "에어컨", category: "가전", issue: "", detail: "", cost: "", vendor: "" });
    setMessage("수리 내역을 추가했어요.");
  }

  function removeRepair(repairId) {
    setData((prev) => ({
      ...prev,
      rooms: prev.rooms.map((room) =>
        room.id === selectedRoomId
          ? { ...room, repairs: room.repairs.filter((repair) => repair.id !== repairId) }
          : room
      ),
    }));
  }

  function addCommonCost() {
    if (!newCostForm.month) return;
    const next = {
      month: newCostForm.month,
      electricity: Number(newCostForm.electricity || 0),
      water: Number(newCostForm.water || 0),
      commonMaintenance: Number(newCostForm.commonMaintenance || 0),
    };
    setData((prev) => ({ ...prev, commonCosts: [next, ...prev.commonCosts] }));
    setNewCostForm({ month: "", electricity: "", water: "", commonMaintenance: "" });
    setMessage("공용 비용을 저장했어요.");
  }

  function resetAll() {
    const ok = window.confirm("입력한 내용을 모두 초기 상태로 되돌릴까요?");
    if (!ok) return;
    setData(초기데이터);
    setSelectedRoomId(초기데이터.rooms[0].id);
    setMessage("초기 데이터로 되돌렸어요.");
  }

  const mobileTwoCol = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: 10,
  };

  const mainGrid = {
    display: "grid",
    gridTemplateColumns: "minmax(280px, 360px) minmax(0, 1fr)",
    gap: 16,
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f3f4f6", fontFamily: "Arial, sans-serif", color: "#111827" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: 14 }}>
        <div
          style={{
            borderRadius: 24,
            overflow: "hidden",
            backgroundImage: `linear-gradient(rgba(15,23,42,0.48), rgba(15,23,42,0.48)), url(${data.building.imageUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            minHeight: 250,
            color: "#fff",
            padding: 22,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
            <div>
              <div style={{ fontSize: 14, opacity: 0.9 }}>건물주용 한글 관리 웹앱</div>
              <h1 style={{ margin: "8px 0 6px", fontSize: 32 }}>{buildingName || data.building.name}</h1>
              <div style={{ fontSize: 15, lineHeight: 1.5 }}>{data.building.summaryText}</div>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "flex-start", flexWrap: "wrap" }}>
              <button style={버튼스타일("light")} onClick={resetAll}>초기화</button>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 10 }}>
            <div style={{ background: "rgba(255,255,255,0.14)", padding: 12, borderRadius: 16 }}>
              <div style={{ fontSize: 12, opacity: 0.9 }}>전체 호실</div>
              <div style={{ fontSize: 24, fontWeight: 800 }}>{summary.total}</div>
            </div>
            <div style={{ background: "rgba(255,255,255,0.14)", padding: 12, borderRadius: 16 }}>
              <div style={{ fontSize: 12, opacity: 0.9 }}>입주 / 공실</div>
              <div style={{ fontSize: 24, fontWeight: 800 }}>{summary.occupied} / {summary.vacant}</div>
            </div>
            <div style={{ background: "rgba(255,255,255,0.14)", padding: 12, borderRadius: 16 }}>
              <div style={{ fontSize: 12, opacity: 0.9 }}>이번 달 미납</div>
              <div style={{ fontSize: 24, fontWeight: 800 }}>{summary.unpaid}</div>
            </div>
            <div style={{ background: "rgba(255,255,255,0.14)", padding: 12, borderRadius: 16 }}>
              <div style={{ fontSize: 12, opacity: 0.9 }}>누적 수리</div>
              <div style={{ fontSize: 24, fontWeight: 800 }}>{summary.repairs}</div>
            </div>
          </div>
        </div>

        <div style={{ ...카드스타일(), marginTop: 14, marginBottom: 14, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <div style={{ color: "#4b5563", fontSize: 14 }}>{message}</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {["전체 현황", "건물 정보", "호실 관리", "호실 상세", "수리 내역", "공용 비용"].map((tab) => (
              <button
                key={tab}
                style={currentTab === tab ? 버튼스타일("dark") : 버튼스타일("light")}
                onClick={() => setCurrentTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {currentTab === "전체 현황" && (
          <div style={{ display: "grid", gap: 16 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 16 }}>
              <요약카드 title="건축년도" value={data.building.buildYear || "-"} sub="건물 기본 정보" />
              <요약카드 title="주차면수" value={`${data.building.parkingCount || 0}대`} sub="1층 주차장 기준" />
              <요약카드 title="CCTV 수" value={`${data.building.cctvCount || 0}대`} sub="건물 전체" />
              <요약카드
                title="이번 달 공용 비용"
                value={`${((latestCommonCost?.electricity || 0) + (latestCommonCost?.water || 0) + (latestCommonCost?.commonMaintenance || 0)).toLocaleString()}원`}
                sub={latestCommonCost?.month || "입력 없음"}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
              <div style={카드스타일()}>
                <h3 style={{ marginTop: 0 }}>건물 구조</h3>
                <div style={{ display: "grid", gap: 10 }}>
                  {data.building.floors.map((floor, index) => (
                    <div key={index} style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #f3f4f6", paddingBottom: 8 }}>
                      <strong>{floor.floor}</strong>
                      <span style={{ color: "#4b5563" }}>{floor.usage}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={카드스타일()}>
                <h3 style={{ marginTop: 0 }}>빠른 확인</h3>
                <div style={{ display: "grid", gap: 12 }}>
                  {data.rooms.slice(0, 4).map((room) => (
                    <div key={room.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
                      <div>
                        <div style={{ fontWeight: 700 }}>{room.number}</div>
                        <div style={{ color: "#6b7280", fontSize: 13 }}>{room.tenantName || "공실"}</div>
                      </div>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        <상태배지 text={room.status} />
                        <상태배지 text={room.rentPaid ? "납부 완료" : "미납"} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {currentTab === "건물 정보" && (
          <div style={{ display: "grid", gap: 16 }}>
            <div style={카드스타일()}>
              <h2 style={{ marginTop: 0 }}>건물 기본 정보</h2>
              <div style={{ ...mobileTwoCol, marginBottom: 10 }}>
                <div>
                  <label>건물명</label>
                  <input style={입력스타일()} value={data.building.name} onChange={(e) => updateBuildingField("name", e.target.value)} />
                </div>
                <div>
                  <label>건축년도</label>
                  <input style={입력스타일()} type="number" value={data.building.buildYear} onChange={(e) => updateBuildingField("buildYear", e.target.value)} />
                </div>
                <div>
                  <label>주소</label>
                  <input style={입력스타일()} value={data.building.address} onChange={(e) => updateBuildingField("address", e.target.value)} />
                </div>
                <div>
                  <label>건물 형태</label>
                  <input style={입력스타일()} value={data.building.buildingType} onChange={(e) => updateBuildingField("buildingType", e.target.value)} />
                </div>
                <div>
                  <label>주차면수</label>
                  <input style={입력스타일()} type="number" value={data.building.parkingCount} onChange={(e) => updateBuildingField("parkingCount", e.target.value)} />
                </div>
                <div>
                  <label>CCTV 수</label>
                  <input style={입력스타일()} type="number" value={data.building.cctvCount} onChange={(e) => updateBuildingField("cctvCount", e.target.value)} />
                </div>
              </div>
              <div style={{ marginBottom: 10 }}>
                <label>첫 화면 건물 사진 주소</label>
                <input style={입력스타일()} value={data.building.imageUrl} onChange={(e) => updateBuildingField("imageUrl", e.target.value)} />
              </div>
              <div>
                <label>첫 화면 안내 문구</label>
                <input style={입력스타일()} value={data.building.summaryText} onChange={(e) => updateBuildingField("summaryText", e.target.value)} />
              </div>
            </div>

            <div style={카드스타일()}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                <h2 style={{ margin: 0 }}>층별 구성</h2>
                <button style={버튼스타일("light")} onClick={addFloor}>층 추가</button>
              </div>
              <div style={{ display: "grid", gap: 12, marginTop: 12 }}>
                {data.building.floors.map((floor, index) => (
                  <div key={index} style={{ ...mobileTwoCol, alignItems: "end" }}>
                    <div>
                      <label>층</label>
                      <input style={입력스타일()} value={floor.floor} onChange={(e) => updateFloor(index, "floor", e.target.value)} />
                    </div>
                    <div>
                      <label>용도</label>
                      <input style={입력스타일()} value={floor.usage} onChange={(e) => updateFloor(index, "usage", e.target.value)} />
                    </div>
                    <div>
                      <button style={버튼스타일("light")} onClick={() => removeFloor(index)}>삭제</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {currentTab === "호실 관리" && (
          <div style={mainGrid}>
            <div style={카드스타일()}>
              <h2 style={{ marginTop: 0 }}>호실 목록</h2>
              <input style={{ ...입력스타일(), marginBottom: 10 }} placeholder="호실번호, 세입자, 상태 검색" value={search} onChange={(e) => setSearch(e.target.value)} />

              <div style={{ display: "grid", gap: 14 }}>
                {Object.keys(roomsByFloor)
                  .sort()
                  .map((floor) => (
                    <div key={floor} style={{ marginBottom: 4 }}>
                      <h3
                        style={{
                          background: "#111827",
                          color: "#fff",
                          padding: "10px 12px",
                          borderRadius: 10,
                          marginBottom: 10,
                          fontSize: 16,
                        }}
                      >
                        {floor}
                      </h3>

                      <div style={{ display: "grid", gap: 10 }}>
                        {roomsByFloor[floor].map((room) => (
                          <div
                            key={room.id}
                            onClick={() => {
                              setSelectedRoomId(room.id);
                              setCurrentTab("호실 상세");
                            }}
                            style={{
                              border: selectedRoomId === room.id ? "2px solid #111827" : "1px solid #e5e7eb",
                              borderRadius: 14,
                              padding: 12,
                              cursor: "pointer",
                              background: "#fff",
                            }}
                          >
                            <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center" }}>
                              <strong>{room.number}</strong>
                              <상태배지 text={room.status} />
                            </div>
                            <div style={{ marginTop: 8, color: "#6b7280", fontSize: 14 }}>
                              {room.roomType} · {room.floor}
                            </div>
                            <div style={{ marginTop: 4, color: "#6b7280", fontSize: 14 }}>
                              {room.tenantName || "세입자 없음"}
                            </div>
                            <div style={{ marginTop: 8, display: "flex", gap: 6, flexWrap: "wrap" }}>
                              <상태배지 text={room.rentPaid ? "납부 완료" : "미납"} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div style={카드스타일()}>
              <h2 style={{ marginTop: 0 }}>새 호실 추가</h2>
              <div style={mobileTwoCol}>
                <div>
                  <label>호실 번호</label>
                  <input style={입력스타일()} value={newRoomForm.number} onChange={(e) => setNewRoomForm({ ...newRoomForm, number: e.target.value })} placeholder="예: 401호" />
                </div>
                <div>
                  <label>층</label>
                  <select style={입력스타일()} value={newRoomForm.floor} onChange={(e) => setNewRoomForm({ ...newRoomForm, floor: e.target.value })}>
                    {data.building.floors.map((floor, index) => (
                      <option key={index} value={floor.floor}>{floor.floor}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label>방 종류</label>
                  <select style={입력스타일()} value={newRoomForm.roomType} onChange={(e) => setNewRoomForm({ ...newRoomForm, roomType: e.target.value })}>
                    <option value="1룸">1룸</option>
                    <option value="1.5룸">1.5룸</option>
                  </select>
                </div>
                <div>
                  <label>보증금(만원)</label>
                  <input style={입력스타일()} type="number" value={newRoomForm.deposit} onChange={(e) => setNewRoomForm({ ...newRoomForm, deposit: e.target.value })} />
                </div>
                <div>
                  <label>월세(만원)</label>
                  <input style={입력스타일()} type="number" value={newRoomForm.monthlyRent} onChange={(e) => setNewRoomForm({ ...newRoomForm, monthlyRent: e.target.value })} />
                </div>
                <div>
                  <label>관리비(만원)</label>
                  <input style={입력스타일()} type="number" value={newRoomForm.maintenanceFee} onChange={(e) => setNewRoomForm({ ...newRoomForm, maintenanceFee: e.target.value })} />
                </div>
                <div>
                  <label>납부일</label>
                  <input style={입력스타일()} type="number" value={newRoomForm.payDay} onChange={(e) => setNewRoomForm({ ...newRoomForm, payDay: e.target.value })} />
                </div>
              </div>
              <div style={{ marginTop: 12 }}>
                <button style={버튼스타일("dark")} onClick={addRoom}>호실 추가하기</button>
              </div>
            </div>
          </div>
        )}

        {currentTab === "호실 상세" && selectedRoom && (
          <div style={{ display: "grid", gap: 16 }}>
            <div style={카드스타일()}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                <div>
                  <h2 style={{ margin: 0 }}>{selectedRoom.number}</h2>
                  <div style={{ color: "#6b7280", marginTop: 6 }}>{selectedRoom.floor} · {selectedRoom.roomType}</div>
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <상태배지 text={selectedRoom.status} />
                  <상태배지 text={selectedRoom.rentPaid ? "납부 완료" : "미납"} />
                  <button style={selectedRoom.rentPaid ? 버튼스타일("green") : 버튼스타일("red")} onClick={toggleRentPaid}>
                    {selectedRoom.rentPaid ? "미납으로 바꾸기" : "납부 완료로 바꾸기"}
                  </button>
                </div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
              <div style={카드스타일()}>
                <h3 style={{ marginTop: 0 }}>계약 / 월세 정보</h3>
                <div style={mobileTwoCol}>
                  <div>
                    <label>호실 번호</label>
                    <input style={입력스타일()} value={selectedRoom.number} onChange={(e) => updateRoomField("number", e.target.value)} />
                  </div>
                  <div>
                    <label>층</label>
                    <input style={입력스타일()} value={selectedRoom.floor} onChange={(e) => updateRoomField("floor", e.target.value)} />
                  </div>
                  <div>
                    <label>방 종류</label>
                    <select style={입력스타일()} value={selectedRoom.roomType} onChange={(e) => updateRoomField("roomType", e.target.value)}>
                      <option value="1룸">1룸</option>
                      <option value="1.5룸">1.5룸</option>
                    </select>
                  </div>
                  <div>
                    <label>입주 상태</label>
                    <select style={입력스타일()} value={selectedRoom.status} onChange={(e) => updateRoomField("status", e.target.value)}>
                      <option value="입주 중">입주 중</option>
                      <option value="공실">공실</option>
                    </select>
                  </div>
                  <div>
                    <label>보증금(만원)</label>
                    <input style={입력스타일()} type="number" value={selectedRoom.deposit} onChange={(e) => updateRoomField("deposit", e.target.value)} />
                  </div>
                  <div>
                    <label>월세(만원)</label>
                    <input style={입력스타일()} type="number" value={selectedRoom.monthlyRent} onChange={(e) => updateRoomField("monthlyRent", e.target.value)} />
                  </div>
                  <div>
                    <label>관리비(만원)</label>
                    <input style={입력스타일()} type="number" value={selectedRoom.maintenanceFee} onChange={(e) => updateRoomField("maintenanceFee", e.target.value)} />
                  </div>
                  <div>
                    <label>납부일</label>
                    <input style={입력스타일()} type="number" value={selectedRoom.payDay} onChange={(e) => updateRoomField("payDay", e.target.value)} />
                  </div>
                </div>
              </div>

              <div style={카드스타일()}>
                <h3 style={{ marginTop: 0 }}>세입자 정보</h3>
                <div style={{ display: "grid", gap: 10 }}>
                  <div>
                    <label>세입자 이름</label>
                    <input style={입력스타일()} value={selectedRoom.tenantName} onChange={(e) => updateRoomField("tenantName", e.target.value)} />
                  </div>
                  <div>
                    <label>연락처</label>
                    <input style={입력스타일()} value={selectedRoom.tenantPhone} onChange={(e) => updateRoomField("tenantPhone", e.target.value)} />
                  </div>
                  <div>
                    <label>입주일</label>
                    <input style={입력스타일()} type="date" value={selectedRoom.moveInDate} onChange={(e) => updateRoomField("moveInDate", e.target.value)} />
                  </div>
                  <div>
                    <label>계약 종료일</label>
                    <input style={입력스타일()} type="date" value={selectedRoom.contractEndDate} onChange={(e) => updateRoomField("contractEndDate", e.target.value)} />
                  </div>
                  <div>
                    <label>메모</label>
                    <textarea style={{ ...입력스타일(), minHeight: 90 }} value={selectedRoom.note} onChange={(e) => updateRoomField("note", e.target.value)} />
                  </div>
                </div>
              </div>
            </div>

            <div style={카드스타일()}>
              <h3 style={{ marginTop: 0 }}>가전 / 시설 관리</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
                {selectedRoom.items.map((item, itemIndex) => (
                  <div key={`${item.name}-${itemIndex}`} style={{ border: "1px solid #e5e7eb", borderRadius: 16, padding: 14, background: "#fafafa" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, marginBottom: 10 }}>
                      <div>
                        <strong>{item.name}</strong>
                        <div style={{ color: "#6b7280", fontSize: 13, marginTop: 4 }}>{item.category}</div>
                      </div>
                      <상태배지 text={item.status} />
                    </div>
                    <div style={{ display: "grid", gap: 8 }}>
                      <input style={입력스타일()} placeholder="모델번호" value={item.modelNumber} onChange={(e) => updateItem(itemIndex, "modelNumber", e.target.value)} />
                      <input style={입력스타일()} placeholder="A/S 전화번호" value={item.asPhone} onChange={(e) => updateItem(itemIndex, "asPhone", e.target.value)} />
                      <input style={입력스타일()} type="date" value={item.lastRepairDate} onChange={(e) => updateItem(itemIndex, "lastRepairDate", e.target.value)} />
                      <select style={입력스타일()} value={item.status} onChange={(e) => updateItem(itemIndex, "status", e.target.value)}>
                        <option value="정상">정상</option>
                        <option value="점검 필요">점검 필요</option>
                        <option value="수리 중">수리 중</option>
                        <option value="교체 필요">교체 필요</option>
                      </select>
                      <textarea style={{ ...입력스타일(), minHeight: 78 }} placeholder="메모" value={item.note} onChange={(e) => updateItem(itemIndex, "note", e.target.value)} />
                      {item.asPhone ? (
                        <a href={`tel:${item.asPhone}`} style={{ textDecoration: "none" }}>
                          <button style={버튼스타일("light")}>A/S 바로 전화하기</button>
                        </a>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {currentTab === "수리 내역" && selectedRoom && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
            <div style={카드스타일()}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                <h2 style={{ margin: 0 }}>수리 내역 보기</h2>
                <select style={{ ...입력스타일(), width: 180 }} value={selectedRoomId} onChange={(e) => setSelectedRoomId(e.target.value)}>
                  {data.rooms.map((room) => (
                    <option key={room.id} value={room.id}>{room.number}</option>
                  ))}
                </select>
              </div>
              <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
                {selectedRoom.repairs.length ? selectedRoom.repairs.map((repair) => (
                  <div key={repair.id} style={{ border: "1px solid #e5e7eb", borderRadius: 14, padding: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                      <strong>{repair.itemName}</strong>
                      <span style={{ color: "#6b7280", fontSize: 13 }}>{repair.repairDate}</span>
                    </div>
                    <div style={{ marginTop: 8, color: "#374151" }}><b>고장 내용:</b> {repair.issue}</div>
                    <div style={{ marginTop: 6, color: "#374151" }}><b>수리 내용:</b> {repair.detail}</div>
                    <div style={{ marginTop: 6, color: "#6b7280", fontSize: 14 }}>업체명: {repair.vendor || "-"} / 비용: {repair.cost ? `${Number(repair.cost).toLocaleString()}원` : "-"}</div>
                    <div style={{ marginTop: 10 }}>
                      <button style={버튼스타일("light")} onClick={() => removeRepair(repair.id)}>삭제</button>
                    </div>
                  </div>
                )) : <div style={{ color: "#6b7280" }}>등록된 수리 내역이 없어요.</div>}
              </div>
            </div>

            <div style={카드스타일()}>
              <h2 style={{ marginTop: 0 }}>수리 내역 추가</h2>
              <div style={{ display: "grid", gap: 10 }}>
                <div>
                  <label>수리 날짜</label>
                  <input style={입력스타일()} type="date" value={newRepairForm.repairDate} onChange={(e) => setNewRepairForm({ ...newRepairForm, repairDate: e.target.value })} />
                </div>
                <div>
                  <label>항목</label>
                  <select
                    style={입력스타일()}
                    value={newRepairForm.itemName}
                    onChange={(e) => {
                      const selected = selectedRoom.items.find((item) => item.name === e.target.value);
                      setNewRepairForm({
                        ...newRepairForm,
                        itemName: e.target.value,
                        category: selected?.category || "가전",
                      });
                    }}
                  >
                    {selectedRoom.items.map((item) => (
                      <option key={item.name} value={item.name}>{item.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label>고장 내용</label>
                  <input style={입력스타일()} value={newRepairForm.issue} onChange={(e) => setNewRepairForm({ ...newRepairForm, issue: e.target.value })} />
                </div>
                <div>
                  <label>수리 내용</label>
                  <textarea style={{ ...입력스타일(), minHeight: 90 }} value={newRepairForm.detail} onChange={(e) => setNewRepairForm({ ...newRepairForm, detail: e.target.value })} />
                </div>
                <div>
                  <label>비용(원)</label>
                  <input style={입력스타일()} type="number" value={newRepairForm.cost} onChange={(e) => setNewRepairForm({ ...newRepairForm, cost: e.target.value })} />
                </div>
                <div>
                  <label>업체명</label>
                  <input style={입력스타일()} value={newRepairForm.vendor} onChange={(e) => setNewRepairForm({ ...newRepairForm, vendor: e.target.value })} />
                </div>
                <button style={버튼스타일("dark")} onClick={addRepair}>수리 내역 저장하기</button>
              </div>
            </div>
          </div>
        )}

        {currentTab === "공용 비용" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
            <div style={카드스타일()}>
              <h2 style={{ marginTop: 0 }}>월별 공용 비용 입력</h2>
              <div style={{ display: "grid", gap: 10 }}>
                <div>
                  <label>기준 월</label>
                  <input style={입력스타일()} type="month" value={newCostForm.month} onChange={(e) => setNewCostForm({ ...newCostForm, month: e.target.value })} />
                </div>
                <div>
                  <label>전기요금</label>
                  <input style={입력스타일()} type="number" value={newCostForm.electricity} onChange={(e) => setNewCostForm({ ...newCostForm, electricity: e.target.value })} />
                </div>
                <div>
                  <label>수도요금</label>
                  <input style={입력스타일()} type="number" value={newCostForm.water} onChange={(e) => setNewCostForm({ ...newCostForm, water: e.target.value })} />
                </div>
                <div>
                  <label>공용구역 관리비</label>
                  <input style={입력스타일()} type="number" value={newCostForm.commonMaintenance} onChange={(e) => setNewCostForm({ ...newCostForm, commonMaintenance: e.target.value })} />
                </div>
                <button style={버튼스타일("dark")} onClick={addCommonCost}>공용 비용 저장하기</button>
              </div>
            </div>

            <div style={카드스타일()}>
              <h2 style={{ marginTop: 0 }}>공용 비용 내역</h2>
              <div style={{ display: "grid", gap: 10 }}>
                {data.commonCosts.map((cost) => {
                  const total = Number(cost.electricity || 0) + Number(cost.water || 0) + Number(cost.commonMaintenance || 0);
                  return (
                    <div key={cost.month} style={{ border: "1px solid #e5e7eb", borderRadius: 14, padding: 12 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                        <strong>{cost.month}</strong>
                        <span style={{ fontSize: 12, color: "#6b7280" }}>
                          {data.rooms.length ? Math.round(total / data.rooms.length).toLocaleString() : 0}원/호실
                        </span>
                      </div>
                      <div style={{ marginTop: 8, color: "#374151" }}>전기요금: {Number(cost.electricity || 0).toLocaleString()}원</div>
                      <div style={{ marginTop: 4, color: "#374151" }}>수도요금: {Number(cost.water || 0).toLocaleString()}원</div>
                      <div style={{ marginTop: 4, color: "#374151" }}>공용구역 관리비: {Number(cost.commonMaintenance || 0).toLocaleString()}원</div>
                      <div style={{ marginTop: 8, fontWeight: 800 }}>총 공용비: {total.toLocaleString()}원</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        <div style={{ height: 90 }} />
      </div>

      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          background: "#ffffff",
          borderTop: "1px solid #e5e7eb",
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: 6,
          padding: 10,
          zIndex: 50,
        }}
      >
        {[
          ["전체 현황", "홈"],
          ["호실 관리", "호실"],
          ["호실 상세", "상세"],
          ["수리 내역", "수리"],
          ["공용 비용", "비용"],
        ].map(([tab, label]) => (
          <button
            key={tab}
            onClick={() => setCurrentTab(tab)}
            style={{
              border: "none",
              background: currentTab === tab ? "#111827" : "#f3f4f6",
              color: currentTab === tab ? "#fff" : "#111827",
              padding: "12px 8px",
              borderRadius: 12,
              fontSize: 13,
              fontWeight: 700,
            }}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default App;