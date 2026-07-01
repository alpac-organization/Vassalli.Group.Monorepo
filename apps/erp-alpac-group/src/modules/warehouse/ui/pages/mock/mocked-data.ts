export interface DriverRecord {
  id: number;
  licensePlate: string;
  driverName: string;
  status: 'weighing' | 'waiting' | 'loading' | 'completed';
  arrivalDate: string;
  arrivalTime: string;
  action: string;
}

export const driverRecords: DriverRecord[] = [
    {
        id: 1,
        licensePlate: "M 123-456",
        driverName: "Juan Carlos Pérez",
        status: "weighing",
        arrivalDate: "2026-06-29T07:15:00Z",
        arrivalTime: "2026-06-29T07:15:00Z",
        action: "ver detalles"
    },
    {
        id: 2,
        licensePlate: "LE 789-101",
        driverName: "Marcos Antonio Gómez",
        status: "waiting",
        arrivalDate: "2026-06-29T07:30:00Z",
        arrivalTime: "2026-06-29T07:30:00Z",
        action: "ver detalles"
    },
    {
        id: 3,
        licensePlate: "CH 234-567",
        driverName: "Silvio Duarte Rostrán",
        status: "loading",
        arrivalDate: "2026-06-29T07:45:00Z",
        arrivalTime: "2026-06-29T07:45:00Z",
        action: "ver detalles"
    },
    {
        id: 4,
        licensePlate: "M 890-123",
        driverName: "Luis Alberto Mendoza",
        status: "waiting",
        arrivalDate: "2026-06-29T08:00:00Z",
        arrivalTime: "2026-06-29T08:00:00Z",
        action: "ver detalles"
    },
    {
        id: 5,
        licensePlate: "ES 456-789",
        driverName: "Carlos Javier Jirón",
        status: "weighing",
        arrivalDate: "2026-06-29T08:10:00Z",
        arrivalTime: "2026-06-29T08:10:00Z",
        action: "ver detalles"
    },
    {
        id: 6,
        licensePlate: "M 345-678",
        driverName: "José Ramón Palacios",
        status: "waiting",
        arrivalDate: "2026-06-29T08:15:00Z",
        arrivalTime: "2026-06-29T08:15:00Z",
        action: "ver detalles"
    },
    {
        id: 7,
        licensePlate: "LE 901-234",
        driverName: "Francisco José Altamirano",
        status: "loading",
        arrivalDate: "2026-06-29T08:20:00Z",
        arrivalTime: "2026-06-29T08:20:00Z",
        action: "ver detalles"
    },
    {
        id: 8,
        licensePlate: "CH 567-890",
        driverName: "Manuel Salvador Blandón",
        status: "loading",
        arrivalDate: "2026-06-29T08:30:00Z",
        arrivalTime: "2026-06-29T08:30:00Z",
        action: "ver detalles"
    },
    {
        id: 9,
        licensePlate: "M 234-567",
        driverName: "Reynaldo Antonio Urbina",
        status: "waiting",
        arrivalDate: "2026-06-29T08:35:00Z",
        arrivalTime: "2026-06-29T08:35:00Z",
        action: "ver detalles"
    },
    {
        id: 10,
        licensePlate: "MY 678-901",
        driverName: "Héctor Danilo Martínez",
        status: "weighing",
        arrivalDate: "2026-06-29T08:40:00Z",
        arrivalTime: "2026-06-29T08:40:00Z",
        action: "ver detalles"
    },
    {
        id: 11,
        licensePlate: "M 789-012",
        driverName: "Julio César Zelaya",
        status: "loading",
        arrivalDate: "2026-06-29T08:45:00Z",
        arrivalTime: "2026-06-29T08:45:00Z",
        action: "ver detalles"
    },
    {
        id: 12,
        licensePlate: "ES 123-456",
        driverName: "Denis Omar Gutiérrez",
        status: "waiting",
        arrivalDate: "2026-06-29T08:50:00Z",
        arrivalTime: "2026-06-29T08:50:00Z",
        action: "ver detalles"
    },
    {
        id: 13,
        licensePlate: "LE 456-789",
        driverName: "Álvaro José Somarriba",
        status: "waiting",
        arrivalDate: "2026-06-29T08:55:00Z",
        arrivalTime: "2026-06-29T08:55:00Z",
        action: "ver detalles"
    },
    {
        id: 14,
        licensePlate: "CH 890-123",
        driverName: "Sandro Mauricio Meléndez",
        status: "weighing",
        arrivalDate: "2026-06-29T09:00:00Z",
        arrivalTime: "2026-06-29T09:00:00Z",
        action: "ver detalles"
    },
    {
        id: 15,
        licensePlate: "M 567-890",
        driverName: "Walter Enrique Espinoza",
        status: "loading",
        arrivalDate: "2026-06-29T09:05:00Z",
        arrivalTime: "2026-06-29T09:05:00Z",
        action: "ver detalles"
    },
    {
        id: 16,
        licensePlate: "MY 234-567",
        driverName: "Félix Antonio Centeno",
        status: "loading",
        arrivalDate: "2026-06-29T09:10:00Z",
        arrivalTime: "2026-06-29T09:10:00Z",
        action: "ver detalles"
    },
    {
        id: 17,
        licensePlate: "M 901-234",
        driverName: "Nelson Vladimir Ruíz",
        status: "waiting",
        arrivalDate: "2026-06-29T09:15:00Z",
        arrivalTime: "2026-06-29T09:15:00Z",
        action: "ver detalles"
    },
    {
        id: 18,
        licensePlate: "LE 678-901",
        driverName: "Bayardo José Pastora",
        status: "weighing",
        arrivalDate: "2026-06-29T09:20:00Z",
        arrivalTime: "2026-06-29T09:20:00Z",
        action: "ver detalles"
    },
    {
        id: 19,
        licensePlate: "CH 123-456",
        driverName: "Noel Alfonso Mairena",
        status: "waiting",
        arrivalDate: "2026-06-29T09:25:00Z",
        arrivalTime: "2026-06-29T09:25:00Z",
        action: "ver detalles"
    },
    {
        id: 20,
        licensePlate: "M 456-789",
        driverName: "Oscar Danilo Sequeira",
        status: "loading",
        arrivalDate: "2026-06-29T09:30:00Z",
        arrivalTime: "2026-06-29T09:30:00Z",
        action: "ver detalles"
    },
    {
        id: 21,
        licensePlate: "ES 789-012",
        driverName: "Ernesto Cardenal Dávila",
        status: "waiting",
        arrivalDate: "2026-06-29T09:35:00Z",
        arrivalTime: "2026-06-29T09:35:00Z",
        action: "ver detalles"
    },
    {
        id: 22,
        licensePlate: "M 890-567",
        driverName: "Jorge Luis Balladares",
        status: "weighing",
        arrivalDate: "2026-06-29T09:40:00Z",
        arrivalTime: "2026-06-29T09:40:00Z",
        action: "ver detalles"
    },
    {
        id: 23,
        licensePlate: "LE 234-890",
        driverName: "Mario René Icaza",
        status: "loading",
        arrivalDate: "2026-06-29T09:45:00Z",
        arrivalTime: "2026-06-29T09:45:00Z",
        action: "ver detalles"
    },
    {
        id: 24,
        licensePlate: "CH 678-123",
        driverName: "Roberto Carlos Calderón",
        status: "loading",
        arrivalDate: "2026-06-29T09:50:00Z",
        arrivalTime: "2026-06-29T09:50:00Z",
        action: "ver detalles"
    },
    {
        id: 25,
        licensePlate: "M 101-234",
        driverName: "Marlon José Orozco",
        status: "waiting",
        arrivalDate: "2026-06-29T09:55:00Z",
        arrivalTime: "2026-06-29T09:55:00Z",
        action: "ver detalles"
    },
    {
        id: 26,
        licensePlate: "MY 456-101",
        driverName: "Gabriel Arcángel López",
        status: "weighing",
        arrivalDate: "2026-06-29T10:00:00Z",
        arrivalTime: "2026-06-29T10:00:00Z",
        action: "ver detalles"
    },
    {
        id: 27,
        licensePlate: "M 789-567",
        driverName: "Róger Antonio Talavera",
        status: "waiting",
        arrivalDate: "2026-06-29T10:05:00Z",
        arrivalTime: "2026-06-29T10:05:00Z",
        action: "ver detalles"
    },
    {
        id: 28,
        licensePlate: "ES 234-901",
        driverName: "Wilfredo José Castrillo",
        status: "loading",
        arrivalDate: "2026-06-29T10:10:00Z",
        arrivalTime: "2026-06-29T10:10:00Z",
        action: "ver detalles"
    },
    {
        id: 29,
        licensePlate: "LE 890-456",
        driverName: "Allan Gerardo Solís",
        status: "waiting",
        arrivalDate: "2026-06-29T10:15:00Z",
        arrivalTime: "2026-06-29T10:15:00Z",
        action: "ver detalles"
    },
    {
        id: 30,
        licensePlate: "CH 901-789",
        driverName: "Gustavo Adolfo Benavídez",
        status: "weighing",
        arrivalDate: "2026-06-29T10:20:00Z",
        arrivalTime: "2026-06-29T10:20:00Z",
        action: "ver detalles"
    }
];
