import React, { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const translateWeatherDescription = (description) => {
    const translations = {
      'clear sky': 'ясное небо',
      'few clouds': 'небольшая облачность',
      'scattered clouds': 'рассеянные облака',
      'broken clouds': 'разбитые облака',
      'shower rain': 'ливень',
      'rain': 'дождь',
      'thunderstorm': 'гроза',
      'snow': 'снег',
      'mist': 'туман'
    };
    return translations[description.toLowerCase()] || description;
  };
  const [weather, setWeather] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [taskTime, setTaskTime] = useState('');

  useEffect(() => {
    // Fetch weather data
    const fetchWeather = async () => {
      try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=Kyzylorda&appid=b5ea08d348cecdf80cbd2068f86f3a44&units=metric`);
        setWeather(response.data);
      } catch (error) {
        console.error('Error fetching the weather data', error);
      }
    };

    fetchWeather();
  }, []);

  useEffect(() => {
    if (weather) {
      // Determine clothing recommendation based on weather
      let recommendation = '';
      if (weather.weather[0].main === 'Clear') {
        recommendation = 'Сегодня солнечно. Наденьте закрытую одежду, возьмите с собой зонтик и используйте крем от загара.';
      } else if (weather.weather[0].main === 'Rain') {
        recommendation = 'Сегодня дождь. Возьмите с собой зонтик и наденьте водонепроницаемую одежду.';
      } else if (weather.weather[0].main === 'Snow') {
        recommendation = 'Сегодня снег. Наденьте теплую одежду и не забудьте шапку и перчатки.';
      } else {
        recommendation = 'Сегодня погода неопределенная. Наденьте одежду по сезону и будьте готовы к любым изменениям.';
      }

      // Notify about the weather and recommendations
      const message = `Сегодня ${translateWeatherDescription(weather.weather[0].description)}. Температура: ${weather.main.temp}°C. ${recommendation}`;
      toast.info(message);
    }
  }, [weather]);

  const addTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, { task: newTask, time: taskTime }]);
      setNewTask('');
      setTaskTime('');
      toast.success('Задача добавлена!');
    }
  };

  const removeTask = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
    toast.error('Задача удалена!');
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Приложение для здоровья</h1>
        <h2>Погода:</h2>
        {weather ? (
          <div>
            <p>{translateWeatherDescription(weather.weather[0].description)}</p>
            <p>Температура: {weather.main.temp}°C</p>
          </div>
        ) : (
          <p>Загрузка погоды...</p>
        )}
        <div className="tasks">
          <h2>Задачи для приема лекарств и мазей</h2>
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Введите новую задачу"
          />
          <input
            type="time"
            value={taskTime}
            onChange={(e) => setTaskTime(e.target.value)}
            placeholder="Введите время задачи"
          />
          <div>
          <button onClick={addTask}>Добавить задачу</button></div>
          <ul>
            {tasks.map((task, index) => (
              <li key={index}>
                {task.task} в {task.time} <button onClick={() => removeTask(index)}>Удалить</button>
              </li>
            ))}
          </ul>
        </div>
      </header>
      <ToastContainer />
    </div>
  );
};

export default App;

