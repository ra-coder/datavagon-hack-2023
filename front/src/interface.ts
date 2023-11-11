export interface TrainEvent {
    moment: number
    vagon_ids: number[];
    dislocation: {
        id: number;
        name: string;
        latitude: number;
        longitude: number;
    },
}
