export interface Room {
    id: number;
    roomName: string;
    capacity: number;
    isAvailable: boolean;
    roomTypeId: number;
    buildingId: number;
    roomType?: {
        id: number;
        name: string;
    };
    building?: {
        id: number;
        name: string;
    };
    type?: string; 
}