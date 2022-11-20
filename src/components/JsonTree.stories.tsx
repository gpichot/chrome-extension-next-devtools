import { ComponentMeta, ComponentStory } from "@storybook/react";

import JsonTree, {
  JsonTreeBoolean,
  JsonTreeNull,
  JsonTreeNumber,
  JsonTreeString,
} from "./JsonTree";

export default {
  title: "Components/JsonTree",
  component: JsonTree,
  subcomponents: {
    JsonTreeNull,
    JsonTreeBoolean,
    JsonTreeNumber,
    JsonTreeString,
  },
} as ComponentMeta<typeof JsonTree>;

const Template: ComponentStory<typeof JsonTree> = (args) => (
  <JsonTree {...args} />
);

export const Default = Template.bind({});
Default.args = {
  autofocus: true,
  data: {
    null: null,
    boolean: true,
    number: 123,
    string: "abc",
    array: [1, 2, 3],
    object: {
      a: 1,
      b: 2,
      c: 3,
    },
  },
};
