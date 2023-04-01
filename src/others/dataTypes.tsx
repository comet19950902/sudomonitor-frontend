// for Collection Table Row
export interface COLLECT {
	id: number,
	address: string,
	logoUrl: string,
	name: string,
	symbol: string,
	listings: string,
	floorPrice: string,
	volumn: string
}

// for NFT Card
export interface NFT {
	id: number,
	occur: string,
	toeknId: string,
	price: string,
	lastDate: string,
	imageUrl: string
}

// for Collection Table Header Cell Item
export interface ITableHCellProps {
    cellType: string;
    cellName: string;
    handleSort: any;
}

//export const BASE_URL:string = "http://localhost:8000";
export const BASE_URL:string = "https://sudomonitor.vercel.app";