import Card from '@/app/(user)/support/markdown/card';
import CardGrid from '@/app/(user)/support/markdown/cardgrid';
import { FileTree } from '@/app/(user)/support/markdown/dynamic-filetree';
import {
  File,
  Folder,
} from '@/app/(user)/support/markdown/filetree';
import RoutedLink from '@/app/(user)/support/markdown/link';
import Mermaid from '@/app/(user)/support/markdown/mermaid';
import Note from '@/app/(user)/support/markdown/note';
import {
  Step,
  StepItem,
} from '@/app/(user)/support/markdown/step';
import Pre from '@/app/(user)/support/ui/pre';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/app/(user)/support/ui/tabs';

export const components = {
  a: RoutedLink,
  Card,
  CardGrid,
  FileTree,
  Folder,
  File,
  Mermaid,
  Note,
  pre: Pre,
  Step,
  StepItem,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
};
