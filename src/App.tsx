import { useEffect, useState } from "react";
import "./App.css";
import { getMockData, MockData } from "data";
import useIntersectionObserver from "hooks/useIntersectionObserver";

function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [data, setDatas] = useState<MockData[]>([]);
  const [pageNum, setPageNum] = useState<number>(0);
  const [isEnd, setIsEnd] = useState<boolean>(false);
  const onIntersect: IntersectionObserverCallback = async (
    [entry],
    observer
  ) => {
    if (entry.isIntersecting && !isLoaded && !isEnd) {
      observer.unobserve(entry.target);
      await getMoreItem();
      observer.observe(entry.target);
    }
  };
  const getMoreItem = async () => {
    console.log(pageNum);
    setIsLoaded(true);
    setPageNum((prev) => prev + 1);
    await getMockData(pageNum).then((values) => {
      setDatas((prevDatas) => [...prevDatas, ...values.datas]);
      setIsEnd(values.isEnd);
    });

    setIsLoaded(false);
  };

  const { setTarget } = useIntersectionObserver({
    root: null,
    rootMargin: "0px",
    threshold: 0.5,
    onIntersect,
  });

  useEffect(() => {
    getMoreItem();
  }, []);
  return (
    <div className="App">
      {data &&
        data.map((el, idx) => (
          <div style={{ padding: 30 }} key={idx}>
            {el.productName}: {el.price}
          </div>
        ))}
      <div>current page : {pageNum}</div>
      <div ref={setTarget}>{isLoaded && <div>Loading..</div>}</div>
    </div>
  );
}

export default App;
