import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

function Fundraiser() {
  //   const [blog, setBlog] = useState();
  const router = useRouter();
  // const fid = router.query.id;
  // const fundraiserId = router.query.fundraiserId;
  const id = router.query.fundraiserId;
  console.log(id);
  return (
    <div style={{ marginTop: "100px" }}>
      WORK IN PROGRESS <span>{id}</span>
    </div>
  );
}
// WORK IN PROGRESS <span>{fid}</span>

export default Fundraiser;
