import { ComponentMeta, ComponentStory } from "@storybook/react";

import JsonTree, {
  JsonTreeArray,
  JsonTreeBoolean,
  JsonTreeNull,
  JsonTreeNumber,
  JsonTreeObject,
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
    JsonTreeArray,
    JsonTreeObject,
  },
} as ComponentMeta<typeof JsonTree>;

const Template: ComponentStory<typeof JsonTree> = (args) => (
  <JsonTree {...args} />
);

export const Default = Template.bind({});
Default.args = {
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
