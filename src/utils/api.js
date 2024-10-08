export const fetchSubjects = async (userId, token) => {
  const response = await fetch("https://prep-pulse.onrender.com/api/subjects/getAllSubjects", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ userId }),
  });

  if (response.ok) {
    const data = await response.json();
    return data;
  } else {
    throw new Error("Failed to fetch subjects.");
  }
};

export const fetchChapters = async (subjectId, token) => {
  const response = await fetch("https://prep-pulse.onrender.com/api/chapters/getAllChapters", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ subjectId }),
  });

  if (response.ok) {
    const data = await response.json();
    return data;
  } else {
    throw new Error("Failed to fetch chapters.");
  }
};

export const addSubject = async (subjectName, token) => {
  const response = await fetch("https://prep-pulse.onrender.com/api/subjects/subjects", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name: subjectName }),
  });

  if (response.ok) {
    const data = await response.json();
    return data;
  } else {
    throw new Error("Failed to add subject.");
  }
};

export const addTest = async (testData, token) => {
  const response = await fetch("https://prep-pulse.onrender.com/api/tests/addTests", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(testData),
  });

  if (response.ok) {
    const data = await response.json();
    return data;
  } else {
    throw new Error("Failed to add test.");
  }
};
export const getTotalTestCountByUser = async (userId, token) => {
  const response = await fetch(
    "https://prep-pulse.onrender.com/api/tests/getTotalTestsByUserData",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userId }),
    }
  );

  if (response.ok) {
    const data = await response.json();
    return data;
  } else {
    throw new Error("Failed to get total test count.");
  }
};

export const getTestsDataByChapterId = async (chapter, token) => {
  const response = await fetch(
    "https://prep-pulse.onrender.com/api/tests/getTestsDataByChapterId",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ chapter }),
    }
  );

  if (response.ok) {
    const data = await response.json();
    return data;
  } else {
    throw new Error("Failed to get total test count.");
  }
};

export const addChapter = async (chapterName, subjectId, token) => {
  const response = await fetch("https://prep-pulse.onrender.com/api/chapters/addChapters", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name: chapterName, subjectId }),
  });

  if (response.ok) {
    const data = await response.json();
    return data;
  } else {
    throw new Error("Failed to add chapter.");
  }
};
