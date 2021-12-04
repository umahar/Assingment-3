import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { DataTable } from "react-native-paper";
import Icon from "react-native-vector-icons/FontAwesome";
import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Button,
  Keyboard,
} from "react-native";

const HomeScreen = ({ navigation }) => {
  const [price, setPrice] = React.useState();
  const [discount, setDiscount] = React.useState();
  const [save, setSave] = React.useState();
  const [finalPrice, setFinalPrice] = React.useState();
  const [data, setData] = React.useState([]);
  const [key, setkey] = React.useState();
  const [enabled, setEnabled] = React.useState(true);
  const [editing, setEditing] = React.useState(false);
  var text;
  const saveData = () => {
    const datasaved = [
      ...data,
      { price, save, discount, finalPrice, key: Math.random() },
    ];
    setData(datasaved);
    setPrice("");
    setDiscount("");
    setEnabled(true);
  };
  const discountCalculate = () => {
    setFinalPrice(price * (discount / 100));
    setSave(Math.round(price * (discount / 100)));
    setEnabled(false);
    Keyboard.dismiss();
  };
  const editData = () => {
    const newdata = data.map((item) => {
      if (item.key == key) {
        item.price = price;
        item.save = save;
      }
    });
    setEditing(false);
    text = "Add Data";
    setPrice("");
    setDiscount("");
    setEnabled(true);
  };
  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 30 }}> Discount Calculator! </Text>
      <TextInput
        placeholder="Enter Total Price"
        keyboardType="numeric"
        value={price}
        onChangeText={(price) => {
          setPrice(price);
        }}
        defaultValue={price}
        style={styles.TextInput}
      ></TextInput>
      <TextInput
        placeholder="Enter Discount %"
        keyboardType="numeric"
        value={discount}
        maxLength={3}
        onChangeText={(discount) => {
          setDiscount(discount);
        }}
        style={styles.TextInput}
      ></TextInput>
      <View style={{ flexDirection: "row" }}>
        <Text style={{ padding: 10, fontWeight: "bold" }}>
          {" "}
          Total Price: {price}{" "}
        </Text>
      </View>
      <View style={{ flexDirection: "row" }}>
        <Text style={{ padding: 10, fontWeight: "bold" }}>
          You Saved: {save}
        </Text>
      </View>
      <View style={{ flexDirection: "row" }}>
        <TouchableOpacity style={styles.button} onPress={discountCalculate}>
          <Text style={{ color: "white" }}>Calculate</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={enabled ? styles.disabledButton : styles.button}
          disabled={enabled}
          onPress={editing ? editData : saveData}
        >
          <Text style={{ color: "white" }}>
            {editing ? (text = "Update") : (text = "Add Data")}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            navigation.navigate("History", {
              data,
              setkey,
              setPrice,
              setSave,
              setDiscount,
              setEditing,
              setData,
              setEnabled,
              key,
            })
          }
        >
          <Text style={{ color: "white" }}>History</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            setData("");
          }}
        >
          <Text style={{ color: "white" }}>Clear All History</Text>
        </TouchableOpacity>
      </View>
      <StatusBar style="auto" />
    </View>
  );
};
const Icons = (props) => {
  return (
    <Icon.Button
      name={props.name}
      backgroundColor="white"
      color="red"
      size={18}
      iconStyle={{ padding: 0, margin: 0 }}
    ></Icon.Button>
  );
};
const History = ({ navigation, route }) => {
  const deleteData = () => {
    const filter = route.params.data.filter(
      (item) => item.key != route.params.key
    );
    route.params.setData(filter);
    route.params.text = "Add Data";
    route.params.setPrice("");
    route.params.setDiscount("");
    route.params.setEnabled(true);
  };

  {
    if (route.params.data.length <= 0) {
      return (
        <View style={styles.container}>
          <Text style={{ fontSize: 30 }}>No Data Saved</Text>
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          <Text style={{ fontSize: 30, padding: 20 }}>Your Saved Data</Text>
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>Original Price</DataTable.Title>
              <DataTable.Title>Discount</DataTable.Title>
              <DataTable.Title>Final Price</DataTable.Title>
              <DataTable.Title>Save</DataTable.Title>
              <DataTable.Title numeric>Delete</DataTable.Title>
              <DataTable.Title numeric>Edit</DataTable.Title>
            </DataTable.Header>
            {route.params.data.map((item) => {
              {
                return (
                  <View>
                    <DataTable.Row>
                      <DataTable.Cell>{item.price}</DataTable.Cell>
                      <DataTable.Cell>{item.discount} % </DataTable.Cell>
                      <DataTable.Cell>{item.price - item.save}</DataTable.Cell>
                      <DataTable.Cell>{item.save}</DataTable.Cell>
                      <DataTable.Cell
                        numeric
                        onPress={() => {
                          route.params.setkey(item.key);
                          deleteData();
                        }}
                      >
                        <Icons name="trash" />
                      </DataTable.Cell>
                      <DataTable.Cell
                        numeric
                        onPress={() => {
                          route.params.setkey(item.key);
                          route.params.setPrice(item.price);
                          route.params.setDiscount(item.discount);
                          route.params.setEditing(true);
                          navigation.goBack();
                        }}
                      >
                        <Icons name="edit" />
                      </DataTable.Cell>
                    </DataTable.Row>
                  </View>
                );
              }
            })}
          </DataTable>
        </View>
      );
    }
  }
};
export default function App() {
  const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: "Welcome" }}
        />
        <Stack.Screen name="History" component={History} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  TextInput: {
    borderWidth: 2,
    borderRadius: 50,
    borderColor: "black",
    padding: 10,
    width: "100%",
    marginTop: 25,
  },
  button: {
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
    padding: 10,
    backgroundColor: "black",
    color: "white",
  },
  disabledButton: {
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
    padding: 10,
    backgroundColor: "#BCC0C3",
    color: "white",
  },
  buttonSave: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "black",
    color: "white",
  },
});
