import { useEffect, useState } from "react";
import Heart from "./Heart";

const BASE_URL = "https://web-interview-api-1rl1lp.herokuapp.com";
const USER_EMAIL = "email@example.com";

const Favorite = (props) => {
  const [favorite, setFavorite] = useState(props.favorite);
  const onFavoriteClickHandler = (e) => {
    setFavorite((oldVal) => !oldVal);
    const requestOptions = {
      method: favorite ? "DELETE" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: props.email, course_id: props.id }),
    };
    fetch(BASE_URL + "/jsonapi/v1/favorite", requestOptions)
      .then((response) => response.json())
      .then((data) => {});
  };
  return (
    <div className="courseFavorite" onClick={onFavoriteClickHandler}>
      <Heart fill={favorite ? "#e76f51" : "grey"} />
    </div>
  );
};

const CourseListItem = (props) => {
  const {
    title,
    description,
    instructor_name,
    instructor_image_url,
    favorite,
    id,
  } = props.course;
  const [showDetail, setShowDetail] = useState(false);
  const courseClickHandler = (e) => {
    setShowDetail((oldVal) => !oldVal);
  };
  const descClass = showDetail ? "longDesc" : "shortDesc";
  return (
    <div className="courseListItem" onClick={courseClickHandler}>
      <div className="authorPhoto">
        <img alt="course author" src={instructor_image_url} />
      </div>
      <div
        className="courseInfo"
        style={{ maxHeight: showDetail ? "unset" : "100px" }}
      >
        <div className="courseTitle">{title}</div>
        <div className="authorName"> {instructor_name} </div>
        <div className={"courseDesc " + descClass}> {description} </div>
      </div>
      <Favorite favorite={favorite} id={id} email={USER_EMAIL} />
    </div>
  );
};

const CourseList = (props) => {
  let [isLoaded, setIsLoaded] = useState(false);
  let [error, setError] = useState(null);
  let [courses, setCourses] = useState([]);
  let [favFilter, setFavFilter] = useState(false);
  let [limit, setLimit] = useState(10);
  let [offset, setOffset] = useState(0);
  useEffect(() => {
    const URL = `${BASE_URL}/jsonapi/v1/courses?email=${USER_EMAIL}&page[limit]=${limit}&page[offset]=${offset}`;
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
  }, [favFilter, limit, offset]);
  const onFavoriteClickHandler = (e) => {
    setFavFilter((oldVal) => !oldVal);
  };
  const onNextBtnClick = (e) => {
    setOffset(oldVal => oldVal += 5);
  };
  const onPrevBtnClick = (e) => {
    setOffset(oldVal => Math.max(oldVal-5, 0));
  };
  return isLoaded ? (
    <div className="courseList">
      <div className="courseListHeader">
        <div className="courseListHeaderTitle">Course List:</div>
        <div className="prevBtn">
          <input type="button" value="Previous" onClick={onPrevBtnClick} disabled={offset === 0}/>
        </div>
        <div className="nextBtn">
          <input type="button" value="Next" onClick={onNextBtnClick} />
        </div>
        <div className="favoriteFilter">
          <label htmlFor="favoriteFilter">Favorite only</label>
          <input
            type="checkbox"
            name="favoriteFilter"
            id="favoriteFilter"
            onClick={onFavoriteClickHandler}
          />
        </div>
      </div>
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
