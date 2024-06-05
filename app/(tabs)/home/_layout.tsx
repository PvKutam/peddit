import { Stack } from "expo-router"
const sublayout= ()=>{
return (
    <Stack screenOptions={{headerShown:false}}>
            <Stack.Screen name="index"/>
            <Stack.Screen name="profile"/>
        </Stack>

)
}
export default sublayout


