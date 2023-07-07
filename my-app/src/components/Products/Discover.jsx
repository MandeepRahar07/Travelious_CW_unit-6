import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, Image, Text,useStyleConfig,Button ,HStack ,Center,Flex,Input} from "@chakra-ui/react";



function Discover() {
  const [data, setData] = useState([]);
  const [searchKey, setSearchKey] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [sortOrder, setSortOrder] = useState("");
  const cardStyles = useStyleConfig("Card");


  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchData();
    }, 1000); 

    return () => clearTimeout(delayDebounce); 
  }, [searchKey, currentPage, sortOrder]);

  const fetchData = () => {
    const queryParameters = `Country_like=${searchKey}&_page=${currentPage}&_limit=6${sortOrder ? `&_sort=cost&_order=${sortOrder}` : ""}`;
    const apiUrl = `https://trevelioussite.onrender.com/destination?${queryParameters}`;

    axios
      .get(apiUrl)
      .then((response) => {
        console.log(response.data);
        setData(response.data);
        const totalCount = Number(response.headers["x-total-count"]);
        const calculatedTotalPages = Math.ceil(totalCount / 6);
        setTotalPages(calculatedTotalPages);
      })
      .catch((error) => {
        console.error("Error fetching movies:", error);
      });
  };

  const handleSearchChange = (event) => {
    setSearchKey(event.target.value);
    setCurrentPage(1);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handleAscendingSort = () => {
    setSortOrder("asc");
  };

  const handleDescendingSort = () => {
    setSortOrder("desc");
  };

  const handleNoOrderSort = () => {
    setSortOrder("");
  };

  return (
    <div data-testid="dashboard">
       <Flex direction="column" align="center" py={6}>
        <Input
          data-testid="search_key"
          type="text"
          placeholder="Search Place"
          value={searchKey}
          onChange={handleSearchChange}
          width="300px"
          mb={4}
        />

        <Center>
          <HStack spacing={4}>
            <Button onClick={handleAscendingSort}>Ascending</Button>
            <Button onClick={handleDescendingSort}>Descending</Button>
            <Button onClick={handleNoOrderSort}>No Order</Button>
          </HStack>
        </Center>
      </Flex>

      <div >
      <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={6}>
      {data.map((e) => (
        <Box
          key={e.id}
          className="destination-card"
          // onClick={() => handleImageClick(e.id)}
          cursor="pointer"
          borderRadius="md"
          overflow="hidden"
          transition="transform 0.3s ease-in-out"
          _hover={{
            transform: "scale(1.1)",
          }}
        >
          <Image
            src={e.url}
            alt="not pic"
            objectFit="cover"
            width="100%"
            height="100%"
            sx={cardStyles}
          />
          <Text
            position="absolute"
            bottom="0"
            left="0"
            width="100%"
            padding="4"
            color="white"
            fontWeight="bold"
            // bg="rgba(0, 0, 0, 0.5)"
            opacity={0.8}
            transition="opacity 0.3s"
          >
            {e.name}
          </Text>
        </Box>
      ))}
    </Box>

      </div>
      <Center className="pagination">
      <Box paddingTop="30px">
        <HStack spacing={4}>
          {currentPage > 1 && (
            <Button
              onClick={handlePreviousPage}
              colorScheme="teal"
              _hover={{
                backgroundColor: 'teal.500',
                color: 'white',
              }}
            >
              Previous
            </Button>
          )}
          {currentPage < totalPages && (
            <Button
              onClick={handleNextPage}
              colorScheme="teal"
              _hover={{
                backgroundColor: 'teal.500',
                color: 'white',
              }}
            >
              Next
            </Button>
          )}
        </HStack>
      </Box>
    </Center>
    </div>
  );
}

export default Discover;