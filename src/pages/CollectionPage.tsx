import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

import renderImage from '../components/ImagePreview';
import { COLLECT, ITableHCellProps, BASE_URL } from '../others/dataTypes';
import { CollectionContext } from '../context/CollectionContext';
import { NFTContext } from '../context/NFTContext';

const CollectionPage = () => {
    const { setNFTData } = useContext( NFTContext );
    const { setColData } = useContext( CollectionContext );
    const navigate = useNavigate();
    const [collects, setCollects] = useState<COLLECT[]>([]);
    const [sortOrder, setSortOrder] = useState<string>('asc');

    const TableHCell: React.FC<ITableHCellProps> = ({ cellType, cellName, handleSort }) => {
        return (
            <TableCell
                onClick={() => handleSort(cellType)}
                style={{ cursor: "pointer" }}
            >
                {cellName}
            </TableCell>
        );
    };
    
    const handleRowClick = async(selectedRow: COLLECT) => {
        console.log(selectedRow.address);
        const { data } = await axios.get( `${BASE_URL}/getNFTs/`, { params: { occur: selectedRow.address } });
        const result = data.data;

        // Update NFT context with new data
        setNFTData( result );
        setColData( selectedRow );
        navigate(`/getNFTs`);
    }
    
    const handleSort = (field: keyof COLLECT) => {
        let sortedRows: COLLECT[] = [...collects];
        
        if (sortOrder === 'asc') {
            sortedRows = sortedRows.sort((a, b) => a[field] > b[field] ? 1 : -1);
            setSortOrder('desc');
        } else {
            sortedRows = sortedRows.sort((a, b) => a[field] < b[field] ? 1 : -1);
            setSortOrder('asc');
        }
      
        setCollects(sortedRows);
    }
  
    useEffect(() => {
        async function fetchData(){
            try{
                const response = await axios.get(`http://localhost:8000/getCollections`);
                console.log("data ", response.status, response.data)
                setCollects(response.data.data);
            } catch(err){
                console.log(`Error retrieving Collections: ${err}`);
            }
        }

        fetchData();
    }, []);
    
    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableHCell cellType="name" cellName="Name" handleSort={ handleSort } />
                        <TableCell align="center"
                            onClick={() => handleSort('listings')}
                            style={{cursor: 'pointer'}}
                        >
                            Listings
                        </TableCell>
                        <TableCell align="center"
                            onClick={() => handleSort('floorPrice')}
                            style={{cursor: 'pointer'}}
                        >
                            Floor Price
                        </TableCell>
                        <TableCell align="center"
                            onClick={() => handleSort('volumn')}
                            style={{cursor: 'pointer'}}
                        >
                            Volume
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        collects && collects.length >0 && collects.map((nft:any) => (
                            <TableRow
                                hover
                                key={nft.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                onClick={() => handleRowClick(nft.fields)}
                                style={{cursor: 'pointer'}}
                            >
                                <TableCell component="th" scope="row">
                                    {
                                        renderImage(nft.fields.logoUrl, nft.fields.name)
                                    }
                                </TableCell>
                                <TableCell align="center">{nft.fields.listings}</TableCell>
                                <TableCell align="center">{nft.fields.floorPrice}</TableCell>
                                <TableCell align="center">{nft.fields.volumn}</TableCell>
                            </TableRow>
                        ))
                    }					
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default CollectionPage;