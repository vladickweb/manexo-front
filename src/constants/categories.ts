import BookIcon from "@/assets/svg/book.svg";
import CareIcon from "@/assets/svg/care.svg";
import DogIcon from "@/assets/svg/dog.svg";
import HomeIcon from "@/assets/svg/home.svg";
import OtherIcon from "@/assets/svg/other.svg";
import SportIcon from "@/assets/svg/sport.svg";
import BoxingIcon from "@/assets/svg/subcategories/boxing.svg";
import ChildCareIcon from "@/assets/svg/subcategories/childcare.svg";
import CleaningIcon from "@/assets/svg/subcategories/cleaning.svg";
import DogWalkerIcon from "@/assets/svg/subcategories/dog-walker.svg";
import ElderCareIcon from "@/assets/svg/subcategories/elderly-care.svg";
import GardeningIcon from "@/assets/svg/subcategories/gardening.svg";
import HandymanIcon from "@/assets/svg/subcategories/handyman.svg";
import IroningIcon from "@/assets/svg/subcategories/ironing.svg";
import LanguagesIcon from "@/assets/svg/subcategories/languages.svg";
import MassageIcon from "@/assets/svg/subcategories/massage.svg";
import MusicIcon from "@/assets/svg/subcategories/music.svg";
import PadelIcon from "@/assets/svg/subcategories/padel.svg";
import TrainerIcon from "@/assets/svg/subcategories/personal-training.svg";
import PetGroomingIcon from "@/assets/svg/subcategories/pet-grooming.svg";
import PhotographerIcon from "@/assets/svg/subcategories/photographer.svg";
import PhysioIcon from "@/assets/svg/subcategories/physiotherapist.svg";
import PilatesIcon from "@/assets/svg/subcategories/pilates.svg";
import SchoolIcon from "@/assets/svg/subcategories/school.svg";
import TennisIcon from "@/assets/svg/subcategories/tennis.svg";
import YogaIcon from "@/assets/svg/subcategories/yoga.svg";

interface Subcategory {
  id: number;
  name: string;
  description: string;
  icon: string;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  icon: string;
  subcategories: Subcategory[];
}

export const CATEGORIES: Category[] = [
  {
    id: 1,
    name: "Hogar",
    description: "Servicios de hogar",
    icon: HomeIcon,
    subcategories: [
      {
        id: 7,
        name: "Plancha",
        description: "Servicio de planchado a domicilio",
        icon: IroningIcon,
      },
      {
        id: 8,
        name: "Limpieza",
        description: "Servicio de limpieza del hogar",
        icon: CleaningIcon,
      },
      {
        id: 9,
        name: "Manitas",
        description: "Reparaciones y mantenimiento del hogar",
        icon: HandymanIcon,
      },
      {
        id: 10,
        name: "Jardinería",
        description: "Mantenimiento de jardines",
        icon: GardeningIcon,
      },
    ],
  },
  {
    id: 2,
    name: "Clases",
    description: "Servicios de clases",
    icon: BookIcon,
    subcategories: [
      {
        id: 11,
        name: "Música",
        description: "Clases de música",
        icon: MusicIcon,
      },
      {
        id: 12,
        name: "Idiomas",
        description: "Clases de idiomas",
        icon: LanguagesIcon,
      },
      {
        id: 13,
        name: "Colegio",
        description: "Apoyo escolar",
        icon: SchoolIcon,
      },
    ],
  },
  {
    id: 3,
    name: "Deporte",
    description: "Servicios de deporte",
    icon: SportIcon,
    subcategories: [
      {
        id: 14,
        name: "Boxeo",
        description: "Clases de boxeo",
        icon: BoxingIcon,
      },
      {
        id: 15,
        name: "Personal Training",
        description: "Entrenamiento personalizado",
        icon: TrainerIcon,
      },
      {
        id: 16,
        name: "Yoga",
        description: "Clases de yoga",
        icon: YogaIcon,
      },
      {
        id: 17,
        name: "Pilates",
        description: "Clases de pilates",
        icon: PilatesIcon,
      },
      {
        id: 18,
        name: "Pádel",
        description: "Clases de pádel",
        icon: PadelIcon,
      },
      {
        id: 19,
        name: "Tenis",
        description: "Clases de tenis",
        icon: TennisIcon,
      },
    ],
  },
  {
    id: 4,
    name: "Cuidados",
    description: "Servicios de cuidados",
    icon: CareIcon,
    subcategories: [
      {
        id: 20,
        name: "Niños",
        description: "Cuidado de niños",
        icon: ChildCareIcon,
      },
      {
        id: 21,
        name: "Ancianos",
        description: "Cuidado de ancianos",
        icon: ElderCareIcon,
      },
    ],
  },
  {
    id: 5,
    name: "Mascotas",
    description: "Servicios de mascotas",
    icon: DogIcon,
    subcategories: [
      {
        id: 22,
        name: "Peluquería",
        description: "Peluquería para mascotas",
        icon: PetGroomingIcon,
      },
      {
        id: 23,
        name: "Paseador",
        description: "Servicio de paseo de perros",
        icon: DogWalkerIcon,
      },
    ],
  },
  {
    id: 6,
    name: "Otros",
    description: "Otros servicios",
    icon: OtherIcon,
    subcategories: [
      {
        id: 24,
        name: "Fotógrafo",
        description: "Servicios de fotografía",
        icon: PhotographerIcon,
      },
      {
        id: 25,
        name: "Masajista",
        description: "Servicios de masajes",
        icon: MassageIcon,
      },
      {
        id: 26,
        name: "Fisioterapeuta",
        description: "Servicios de fisioterapia",
        icon: PhysioIcon,
      },
    ],
  },
];
