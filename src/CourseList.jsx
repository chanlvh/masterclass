import { useEffect, useState } from "react";
import Heart from "./Heart";

const BASE_URL = "https://web-interview-api-1rl1lp.herokuapp.com";
const USER_EMAIL = "email@example.com"

const Favorite = (props) => {
  const [favorite, setFavorite] = useState(props.favorite);
  const onFavoriteClickHandler = (e) => {
    setFavorite((oldVal) => !oldVal);
    const requestOptions = {
      method: favorite ? "DELETE" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ "email": props.email, "course_id": props.id}),
    };
    fetch(BASE_URL + "/jsonapi/v1/favorite", requestOptions)
      .then((response) => response.json())
      .then((data) => {});
  };
  return (
    <div className="favorite" onClick={onFavoriteClickHandler}>
      <Heart fill={favorite ? "#e76f51" : "grey"} />
    </div>
  );
};

const CourseListItem = (props) => {
  const {
    title,
    description,
    insturctor_name,
    instructor_image_url,
    favorite,
    id,
  } = props.course;
  return (
    <div className="courseListItem">
      <div className="authorPhoto">
        <img alt="course author" src={instructor_image_url} />
      </div>
      <div className="courseInfo">
        {title} <br />
        {description} <br />
        {insturctor_name}
      </div>
      <Favorite favorite={favorite} id={id} email={USER_EMAIL}/>
    </div>
  );
};

const CourseList = (props) => {
  let [isLoaded, setIsLoaded] = useState(false);
  let [error, setError] = useState(null);
  let [courses, setCourses] = useState([]);
  useEffect(() => {
    const URL =
      BASE_URL +
      "/jsonapi/v1/courses?email=" + USER_EMAIL + "&page[limit]=5&page[offset]=2";
    fetch(URL)
      .then((res) => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setCourses(result);
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      );
  }, []);
  return isLoaded ? (
    <div className="CourseList">
      {error !== null ?? "Error while loading the course list: " + error}
      {courses.map((course) => (
        <CourseListItem course={course} key={course.id} />
      ))}
    </div>
  ) : (
    "Loading..."
  );
};

export default CourseList;
