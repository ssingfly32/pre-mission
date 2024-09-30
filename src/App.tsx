import { useEffect, useState } from "react";
import "./App.css";
import { getMockData, MockData } from "data";
import useIntersectionObserver from "hooks/useIntersectionObserver";

function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [data, setDatas] = useState<MockData[]>([]);
  const [pageNum, setPageNum] = useState<number>(0);
  const [isEnd, setIsEnd] = useState<boolean>(false);
  const onIntersect: IntersectionObserverCallback = async ([entry]) => {
    if (entry.isIntersecting && !isLoaded && !isEnd) {
      getMoreItem();
    }
  };
  const getMoreItem = async () => {
    setIsLoaded(true);
    const page = pageNum + 1;
    await getMockData(page).then((values) => {
      setDatas((prevDatas) => [...prevDatas, ...values.datas]);
      setIsEnd(values.isEnd);
    });
    setPageNum(page);
    setIsLoaded(false);
  };

  const { setTarget } = useIntersectionObserver({
    root: null,
    rootMargin: "0px",
    threshold: 0.5,
    onIntersect,
  });

  const calcPrices = () => {
    return data.map(({ price }) => price).reduce((pre, cur) => pre + cur, 0);
  };

  const formatDateStr = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("ko-kr", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  useEffect(() => {
    getMoreItem();
  }, []);
  return (
    <div className="App">
      {data &&
        data.map((el, idx) => (
          <div style={{ padding: 30 }} key={idx}>
            {idx + 1}) {el.productName}: {el.price}
            <div style={{ marginTop: 20 }}>productId: {el.productId}</div>
            <div>boughtDate: {formatDateStr(el.boughtDate)} </div>
          </div>
        ))}
      {data.length > 0 && (
        <div>
          current qty : {data.length} 개, total price : {calcPrices()}
        </div>
      )}
      <div style={{ padding: 30 }} ref={setTarget}>
        {isLoaded && <div>Loading..</div>}
        {isEnd && <div>모든 항목을 불러왔습니다.</div>}
      </div>
    </div>
  );
}

export default App;
