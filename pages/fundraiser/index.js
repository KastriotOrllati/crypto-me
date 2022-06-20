import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Fundraisers() {
  //   const [blogs, setBlogs] = useState();
  const blogs = [1, 2, 3, 4, 5];
  useEffect(() => {
    // const fetchBlogs = async () => {
    //   const response = await fetch("http://localhost:43464/api/blog");
    //   const data = await response.json();
    //   setBlogs(data);
    // };
    // fetchBlogs();
  }, []);
  console.log(blogs);
  return (
    <div>
      <h1>Welcome to my blog!</h1>
      <div>
        {blogs?.map((blog, index) => (
          <Link key={index} href={{ pathname: `/fundraiser/${blog}` }} passHref>
            <div>
              <div>AAAAAAAAAAAAAAAAAAAAAAAAAAAAA {blog}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

// <div className={styles.cardTitle}>{blog.blogTitle}</div>
//   <Image
//     src={defaultPic}
//     width={150}
//     height={200}
//     alt="defaultPicture"
//   />
