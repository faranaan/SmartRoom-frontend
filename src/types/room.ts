export interface Room{
    id: number;
    roomName: string;
    capacity: number;
    type: 'Classroom' | 'Laboratory' | 'MeetingRoom' | 'Auditorium';
    building: 'TowerA' | 'TowerB' | 'TowerC';
    isAvailable: boolean;
}