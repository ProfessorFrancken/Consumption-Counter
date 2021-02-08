import axios from "axios";
import {useMutation, useQuery, useQueryClient} from "react-query";

const handleResponse = (response: any) => {
  if (!response.data) {
    return Promise.reject(response.statusText);
  }
  return response.data;
};

const useTempleCount = () => {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ["temple_count"],
    queryFn: async () => {
      const response = await axios.get(`https://borrelcie.vodka/chwazorcle/hoeveel.php`);

      return await handleResponse(response);
    },
  });

  const decreaseTempleCount = () => {
    queryClient.setQueryData(["temple_count"], (count: number | undefined) =>
      count === undefined ? 0 : count - 1
    );
  };
  const mutation = useMutation(
    () => axios.post(`https://borrelcie.vodka/chwazorcle/hoeveel.php?increment=-1`),
    {onSuccess: decreaseTempleCount}
  );

  return [query.data, mutation.mutate] as const;
};

const TempleCount = () => {
  const [count, decreaseTempleCount] = useTempleCount();

  return (
    <button className="tile button" onClick={() => decreaseTempleCount()}>
      Decrease <br /> Temple Count {count ? ` (${count})` : null}
    </button>
  );
};

export default TempleCount;
