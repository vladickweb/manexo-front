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

export interface Subcategory {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  subcategories: Subcategory[];
}

export const CATEGORIES: Category[] = [
  {
    id: "9ed7b42c-ffe4-41bc-8e05-f453ff3fcae6",
    name: "Hogar",
    description: "Servicios de hogar",
    icon: HomeIcon,
    subcategories: [
      {
        id: "hogar-plancha",
        name: "Plancha",
        description: "Servicio de planchado a domicilio",
        icon: IroningIcon,
      },
      {
        id: "hogar-limpieza",
        name: "Limpieza",
        description: "Servicio de limpieza del hogar",
        icon: CleaningIcon,
      },
      {
        id: "hogar-manitas",
        name: "Manitas",
        description: "Reparaciones y mantenimiento del hogar",
        icon: HandymanIcon,
      },
      {
        id: "hogar-jardineria",
        name: "Jardinería",
        description: "Mantenimiento de jardines",
        icon: GardeningIcon,
      },
    ],
  },
  {
    id: "dca61642-aaa6-45ca-b76a-a8ae9517bbb5",
    name: "Clases",
    description: "Servicios de clases",
    icon: BookIcon,
    subcategories: [
      {
        id: "clases-musica",
        name: "Música",
        description: "Clases de música",
        icon: MusicIcon,
      },
      {
        id: "clases-idiomas",
        name: "Idiomas",
        description: "Clases de idiomas",
        icon: LanguagesIcon,
      },
      {
        id: "clases-colegio",
        name: "Colegio",
        description: "Apoyo escolar",
        icon: SchoolIcon,
      },
    ],
  },
  {
    id: "d8557cf4-f863-4834-a9cb-d493f86cc7f6",
    name: "Deporte",
    description: "Servicios de deporte",
    icon: SportIcon,
    subcategories: [
      {
        id: "deporte-boxeo",
        name: "Boxeo",
        description: "Clases de boxeo",
        icon: BoxingIcon,
      },
      {
        id: "deporte-personal",
        name: "Personal Training",
        description: "Entrenamiento personalizado",
        icon: TrainerIcon,
      },
      {
        id: "deporte-yoga",
        name: "Yoga",
        description: "Clases de yoga",
        icon: YogaIcon,
      },
      {
        id: "deporte-pilates",
        name: "Pilates",
        description: "Clases de pilates",
        icon: PilatesIcon,
      },
      {
        id: "deporte-padel",
        name: "Pádel",
        description: "Clases de pádel",
        icon: PadelIcon,
      },
      {
        id: "deporte-tenis",
        name: "Tenis",
        description: "Clases de tenis",
        icon: TennisIcon,
      },
    ],
  },
  {
    id: "5fb3df80-b298-4014-83a3-dc5dc94035d8",
    name: "Cuidados",
    description: "Servicios de cuidados",
    icon: CareIcon,
    subcategories: [
      {
        id: "cuidados-ninos",
        name: "Niños",
        description: "Cuidado de niños",
        icon: ChildCareIcon,
      },
      {
        id: "cuidados-ancianos",
        name: "Ancianos",
        description: "Cuidado de ancianos",
        icon: ElderCareIcon,
      },
    ],
  },
  {
    id: "3a17e363-5080-4ea9-ad03-ef70b4f95a43",
    name: "Mascotas",
    description: "Servicios de mascotas",
    icon: DogIcon,
    subcategories: [
      {
        id: "mascotas-peluqueria",
        name: "Peluquería",
        description: "Peluquería para mascotas",
        icon: PetGroomingIcon,
      },
      {
        id: "mascotas-paseador",
        name: "Paseador",
        description: "Servicio de paseo de perros",
        icon: DogWalkerIcon,
      },
    ],
  },
  {
    id: "9e23ba51-e40b-4572-a295-0dc1ad6654d4",
    name: "Otros",
    description: "Otros servicios",
    icon: OtherIcon,
    subcategories: [
      {
        id: "otros-fotografo",
        name: "Fotógrafo",
        description: "Servicios de fotografía",
        icon: PhotographerIcon,
      },
      {
        id: "otros-masajista",
        name: "Masajista",
        description: "Servicios de masajes",
        icon: MassageIcon,
      },
      {
        id: "otros-fisio",
        name: "Fisioterapeuta",
        description: "Servicios de fisioterapia",
        icon: PhysioIcon,
      },
    ],
  },
];
